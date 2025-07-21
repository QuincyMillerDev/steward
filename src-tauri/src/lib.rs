// Tauri backend library with Rust commands for Steward AI assistant
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{WebviewUrl, WebviewWindowBuilder, Manager};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn create_settings_window(app: tauri::AppHandle) -> Result<(), String> {
    // Check if settings window already exists
    if let Some(existing) = app.get_webview_window("settings") {
        // Focus existing window
        let _ = existing.set_focus();
        return Ok(());
    }

    // Create new settings window
    let _settings_window = WebviewWindowBuilder::new(&app, "settings", WebviewUrl::App("settings.html".into()))
        .title("Steward Settings")
        .inner_size(600.0, 400.0)
        .min_inner_size(400.0, 300.0)
        .center()
        .resizable(true)
        .decorations(true)
        .visible(true)
        .build()
        .map_err(|e| format!("Failed to create settings window: {}", e))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, create_settings_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
