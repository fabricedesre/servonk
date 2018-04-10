/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

use actix::prelude::*;
use rand::{self, Rng, ThreadRng};
use servo::compositing::compositor_thread::EmbedderMsg;
use servo::msg::constellation_msg::{BrowsingContextId, TopLevelBrowsingContextId};
use servo::servo_url::ServoUrl;
use std::collections::HashMap;
use std::cell::RefCell;

/// Wrapping structure that will be able to carry messages from different services.
// #[derive(Debug, Message, Serialize)]
// pub struct ServiceMessage {
//     service: String,
//     message: ServiceMessagePayload,
// }

#[derive(Debug, Message, Serialize)]
#[serde(tag = "service")]
#[serde(rename_all = "snake_case")]
pub enum ServiceMessage {
    ToSystemApp(MessageToSystemApp),
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct StatusMsg {
    webview_id: String,
    status: Option<String>,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct ChangePageTitleMsg {
    webview_id: String,
    title: Option<String>,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct NewFaviconMsg {
    webview_id: String,
    url: ServoUrl,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct HistoryChangedMsg {
    webview_id: String,
    urls: Vec<ServoUrl>,
    current: usize,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct SetFullscreenStateMsg {
    webview_id: String,
    state: bool,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum ProgressEvent {
    HeadParsed,
    LoadStart,
    LoadComplete,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct ProgressMsg {
    webview_id: String,
    event: ProgressEvent,
}

/// The set of messages that can be sent to the system app.
#[derive(Clone, Debug, Message, Serialize)]
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
}

impl Default for ApiServer {
    fn default() -> ApiServer {
        ApiServer {
            sessions: HashMap::new(),
            rng: RefCell::new(rand::thread_rng()),
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
