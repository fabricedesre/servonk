/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

use actix::prelude::*;
use rand::{self, Rng, ThreadRng};
use servo::compositing::compositor_thread::{EmbedderMsg, EventLoopWaker};
use servo::compositing::windowing::WindowEvent;
use servo::msg::constellation_msg::{BrowsingContextId, BrowsingContextIndex, PipelineNamespaceId,
                                    TopLevelBrowsingContextId, TraversalDirection};
use servo::servo_url::ServoUrl;
use std::cell::RefCell;
use std::collections::HashMap;
use std::mem;
use std::sync::mpsc;

#[derive(Debug, Deserialize, Message, Serialize)]
#[serde(tag = "service")]
#[serde(rename_all = "snake_case")]
pub enum ServiceMessage {
    ToSystemApp(MessageToSystemApp),
    FromSystemApp(MessageFromSystemApp),
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct StatusMsg {
    webview_id: String,
    status: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct ChangePageTitleMsg {
    webview_id: String,
    title: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct NewFaviconMsg {
    webview_id: String,
    url: ServoUrl,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct HistoryChangedMsg {
    webview_id: String,
    urls: Vec<ServoUrl>,
    current: usize,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct SetFullscreenStateMsg {
    webview_id: String,
    state: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum ProgressEvent {
    HeadParsed,
    LoadStart,
    LoadComplete,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct ProgressMsg {
    webview_id: String,
    event: ProgressEvent,
}

/// The set of messages that can be sent to the system app.
#[derive(Clone, Debug, Deserialize, Message, Serialize)]
#[serde(tag = "type")]
#[serde(rename_all = "snake_case")]
pub enum MessageToSystemApp {
    Status(StatusMsg),
    ChangePageTitle(ChangePageTitleMsg),
    NewFavicon(NewFaviconMsg),
    Progress(ProgressMsg),
    HistoryChanged(HistoryChangedMsg),
    SetFullscreenState(SetFullscreenStateMsg),
}

/// Stringify a browser context id.
/// /!\ Keep in sync with the way we do it in htmliframeelement.rs
fn webview_id(id: TopLevelBrowsingContextId) -> String {
    let browsing_context_id: BrowsingContextId = id.into();
    format!(
        "{}-{}",
        browsing_context_id.namespace_id.0,
        browsing_context_id.index.0.get()
    )
}

impl MessageToSystemApp {
    pub fn from_embedder_msg(msg: &EmbedderMsg) -> Option<Self> {
        match msg {
            &EmbedderMsg::Status(browser_id, ref status) => {
                Some(MessageToSystemApp::Status(StatusMsg {
                    webview_id: webview_id(browser_id),
                    status: (*status).clone(),
                }))
            }
            &EmbedderMsg::ChangePageTitle(browser_id, ref title) => {
                Some(MessageToSystemApp::ChangePageTitle(ChangePageTitleMsg {
                    webview_id: webview_id(browser_id),
                    title: (*title).clone(),
                }))
            }
            &EmbedderMsg::NewFavicon(browser_id, ref url) => {
                Some(MessageToSystemApp::NewFavicon(NewFaviconMsg {
                    webview_id: webview_id(browser_id),
                    url: (*url).clone(),
                }))
            }
            &EmbedderMsg::HeadParsed(browser_id) => {
                Some(MessageToSystemApp::Progress(ProgressMsg {
                    webview_id: webview_id(browser_id),
                    event: ProgressEvent::HeadParsed,
                }))
            }
            &EmbedderMsg::HistoryChanged(browser_id, ref entries, current) => {
                Some(MessageToSystemApp::HistoryChanged(HistoryChangedMsg {
                    webview_id: webview_id(browser_id),
                    urls: entries.into_iter().map(|e| e.url.clone()).collect(),
                    current,
                }))
            }
            &EmbedderMsg::SetFullscreenState(browser_id, state) => Some(
                MessageToSystemApp::SetFullscreenState(SetFullscreenStateMsg {
                    webview_id: webview_id(browser_id),
                    state,
                }),
            ),
            &EmbedderMsg::LoadStart(browser_id) => {
                Some(MessageToSystemApp::Progress(ProgressMsg {
                    webview_id: webview_id(browser_id),
                    event: ProgressEvent::LoadStart,
                }))
            }
            &EmbedderMsg::LoadComplete(browser_id) => {
                Some(MessageToSystemApp::Progress(ProgressMsg {
                    webview_id: webview_id(browser_id),
                    event: ProgressEvent::LoadComplete,
                }))
            }
            _ => None,
        }
    }
}

/// Connection from new session.
#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
    pub addr: Recipient<Syn, ServiceMessage>,
}

/// Session is disconnected.
#[derive(Message)]
pub struct Disconnect {
    pub id: usize,
}

/// Actor that relays messages sent from Servo to the WS sessions.
pub struct ApiServer {
    sessions: HashMap<usize, Recipient<Syn, ServiceMessage>>,
    rng: RefCell<ThreadRng>,
    event_queue: Vec<MessageFromSystemApp>,
    servo: Option<mpsc::Sender<MessageFromSystemApp>>,
    waker: Option<Box<EventLoopWaker>>,
}

impl ApiServer {
    pub fn get_events(&mut self) -> Vec<MessageFromSystemApp> {
        mem::replace(&mut self.event_queue, Vec::new())
    }
}

impl Default for ApiServer {
    fn default() -> ApiServer {
        ApiServer {
            sessions: HashMap::new(),
            rng: RefCell::new(rand::thread_rng()),
            event_queue: Vec::new(),
            servo: None,
            waker: None,
        }
    }
}

impl Actor for ApiServer {
    /// We are going to use simple Context, we just need ability to communicate
    /// with other actors.
    type Context = Context<Self>;
}

/// Handler for messages sent to the system app.
impl Handler<MessageToSystemApp> for ApiServer {
    type Result = ();

    fn handle(&mut self, msg: MessageToSystemApp, _: &mut Context<Self>) -> Self::Result {
        info!("Handling MessageToSystemApp {:?}", msg);
        for session in self.sessions.iter() {
            let id = &session.0;
            if let Some(addr) = self.sessions.get(id) {
                let _ = addr.do_send(ServiceMessage::ToSystemApp(msg.clone()));
            }
        }
    }
}

/// Handler for Connect message.
///
/// Register new session and assign unique id to this session
impl Handler<Connect> for ApiServer {
    type Result = usize;

    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        debug!("New session");

        // register session with random id
        let id = self.rng.borrow_mut().gen::<usize>();
        self.sessions.insert(id, msg.addr);

        // send id back
        id
    }
}

/// Handler for Disconnect message.
impl Handler<Disconnect> for ApiServer {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        debug!("Session is disconnecting");

        // Remove address from the session list.
        self.sessions.remove(&msg.id);
    }
}

/// Signals that we need to queue a message coming from the transport layer.
#[derive(Debug, Message)]
pub struct QueueMessage {
    pub message: MessageFromSystemApp,
}

/// Handler for the QueueMessage message.
impl Handler<QueueMessage> for ApiServer {
    type Result = ();

    fn handle(&mut self, msg: QueueMessage, _: &mut Context<Self>) {
        debug!("Queuing {:?}", msg);
        match self.servo {
            Some(ref sender) => {
                sender.send(msg.message).expect("failed to send message");
                if let Some(ref waker) = self.waker {
                    waker.wake();
                } else {
                    error!("No waker available to notify the event loop!");
                }
            }
            None => self.event_queue.push(msg.message),
        }
    }
}

#[derive(Message)]
pub struct SetServoSender {
    pub sender: mpsc::Sender<MessageFromSystemApp>,
    pub waker: Box<EventLoopWaker>,
}

/// Handler for the GetServoSender message.
impl Handler<SetServoSender> for ApiServer {
    type Result = ();

    fn handle(&mut self, msg: SetServoSender, _: &mut Context<Self>) {
        // Drain the queue if we had events waiting.
        self.event_queue.drain(0..).for_each(|queued| {
            msg.sender.send(queued).expect("failed to send message");
        });
        msg.waker.wake();

        self.servo = Some(msg.sender);
        self.waker = Some(msg.waker);
    }
}

/// The set of messages that can be sent from the system app.

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum NavigationDirection {
    Forward(usize),
    Back(usize),
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct NavigateMsg {
    webview_id: String,
    direction: NavigationDirection,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct ReloadMsg {
    webview_id: String,
}

#[derive(Clone, Debug, Message, Deserialize, Serialize)]
#[serde(tag = "type")]
#[serde(rename_all = "snake_case")]
pub enum MessageFromSystemApp {
    Navigate(NavigateMsg),
    Reload(ReloadMsg),
}

/// Converts a stringified browsing context ID into a native type.
fn browser_context_from_string(id_s: &str) -> TopLevelBrowsingContextId {
    use nonzero::NonZeroU32;
    use std::str::FromStr;

    let splitted: Vec<u32> = id_s.split('-')
        .map(|item| u32::from_str(item).unwrap())
        .collect();
    let id = BrowsingContextId {
        namespace_id: PipelineNamespaceId(splitted[0]),
        index: BrowsingContextIndex(NonZeroU32::new(splitted[1]).unwrap()),
    };

    id.into()
}

impl Into<WindowEvent> for MessageFromSystemApp {
    fn into(self) -> WindowEvent {
        match self {
            MessageFromSystemApp::Navigate(nav) => {
                let traversal = match nav.direction {
                    NavigationDirection::Forward(n) => TraversalDirection::Forward(n),
                    NavigationDirection::Back(n) => TraversalDirection::Back(n),
                };
                WindowEvent::Navigation(browser_context_from_string(&nav.webview_id), traversal)
            }
            MessageFromSystemApp::Reload(reload) => {
                WindowEvent::Reload(browser_context_from_string(&reload.webview_id))
            }
        }
    }
}
