use tauri::{Manager, WebviewWindowBuilder};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn open_settings_window(app: tauri::AppHandle) -> Result<(), String> {
    let existing_window = app.get_webview_window("settings-help");
    if let Some(window) = existing_window {
        window.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }

    WebviewWindowBuilder::new(&app, "settings-help", tauri::WebviewUrl::App("index.html?page=settings-help&tab=settings".into()))
        .title("Steward Settings")
        .inner_size(800.0, 600.0)
        .center()
        .resizable(true)
        .always_on_top(false)
        .decorations(true)
        .build()
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, open_settings_window])
        .setup(|app| {
            // Get the main window and ensure it's properly configured
            if let Some(window) = app.get_webview_window("main") {
                window.set_always_on_top(true).ok();
                window.show().ok();
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    api.prevent_close();
                    window.hide().unwrap();
                }
                tauri::WindowEvent::Destroyed => {
                    // When main window is destroyed, close settings window too
                    if window.label() == "main" {
                        let app_handle = window.app_handle();
                        if let Some(settings_window) = app_handle.get_webview_window("settings-help") {
                            let _ = settings_window.close();
                        }
                    }
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
