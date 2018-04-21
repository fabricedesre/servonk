/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

use events_loop::Event;
use servo::compositing::compositor_thread::EmbedderMsg;
use std::sync::mpsc::Sender;

/// Manages the events sent from Servo. Since we only have one window from
/// Servo's point of view, we don't even need to link Browser and BrowserWindow.
/// All communication with the front end can happen from Browser and the api server.

pub struct Browser {
    event_sender: Sender<Event>,
}

impl Browser {
    pub fn new(event_sender: &Sender<Event>) -> Browser {
        Browser {
            event_sender: event_sender.clone(),
        }
    }

    /// Handle Servo Events.
    pub fn handle_servo_events(&mut self, events: Vec<EmbedderMsg>) {
        for event in events {
            println!("Servo event: {:?}", event);
            match event {
                EmbedderMsg::Status(_browser_id, _status) => {
                    // self.status = status;
                }
                EmbedderMsg::ChangePageTitle(_browser_id, _title) => {
                    // self.title = title;

                    // let fallback_title: String = if let Some(ref current_url) = self.current_url {
                    //     current_url.to_string()
                    // } else {
                    //     String::from("Untitled")
                    // };
                    // let title = match self.title {
                    //     Some(ref title) if title.len() > 0 => &**title,
                    //     _ => &fallback_title,
                    // };
                    // let title = format!("{} - Servo", title);
                    // self.window.set_title(&title);
                }
                EmbedderMsg::MoveTo(_browser_id, _point) => {
                    // self.window.set_position(point);
                }
                EmbedderMsg::ResizeTo(_browser_id, _size) => {
                    // self.window.set_inner_size(size);
                }
                EmbedderMsg::AllowNavigation(_browser_id, _url, response_chan) => {
                    if let Err(e) = response_chan.send(true) {
                        warn!("Failed to send allow_navigation() response: {}", e);
                    };
                }
                EmbedderMsg::KeyEvent(_browser_id, _ch, _key, _state, _modified) => {
                    // self.handle_key_from_servo(browser_id, ch, key, state, modified);
                }
                EmbedderMsg::SetCursor(_cursor) => {
                    // self.window.set_cursor(cursor);
                }
                EmbedderMsg::NewFavicon(_browser_id, _url) => {
                    // self.favicon = Some(url);
                }
                EmbedderMsg::HeadParsed(_browser_id) => {
                    // self.loading_state = Some(LoadingState::Loading);
                }
                EmbedderMsg::HistoryChanged(_browser_id, _entries, _current) => {
                    // self.current_url = Some(entries[current].url.clone());
                }
                EmbedderMsg::SetFullscreenState(_browser_id, _state) => {
                    // self.window.set_fullscreen(state);
                }
                EmbedderMsg::LoadStart(_browser_id) => {
                    // self.loading_state = Some(LoadingState::Connecting);
                }
                EmbedderMsg::LoadComplete(_browser_id) => {
                    // self.loading_state = Some(LoadingState::Loaded);
                }
                EmbedderMsg::GetSelectedBluetoothDevice(_, _) => { }
                EmbedderMsg::Shutdown => {
                    self.event_sender
                        .send(Event::ShutdownEvent)
                        .expect("Failed to send shutdown event");
                }
                EmbedderMsg::Panic(_browser_id, _reason, _backtrace) => {}
            }
        }
    }
}
