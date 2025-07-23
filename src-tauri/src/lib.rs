// Tauri backend library for Steward AI assistant with click-through support
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{WebviewUrl, WebviewWindowBuilder, Manager};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn create_settings_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(existing) = app.get_webview_window("settings") {
        let _ = existing.set_focus();
        return Ok(());
    }

    let _settings_window = WebviewWindowBuilder::new(&app, "settings", WebviewUrl::App("settings.html".into()))
        .title("Steward Settings")
        .inner_size(800.0, 700.0)
        .min_inner_size(600.0, 500.0)
        .max_inner_size(1000.0, 800.0)
        .center()
        .resizable(true)
        .decorations(true)
        .visible(true)
        .build()
        .map_err(|e| format!("Failed to create settings window: {}", e))?;

    Ok(())
}

/// Configure click-through behavior for transparent toolbar window
/// Takes array of (x, y, width, height) rectangles for interactive areas
#[tauri::command]
fn configure_toolbar_click_through(window: tauri::Window, regions: Vec<(i32, i32, u32, u32)>) -> Result<(), String> {
    let label = window.label();
    if label != "toolbar" {
        return Err("This command only works for toolbar window".to_string());
    }

    #[cfg(target_os = "linux")]
    {
        // For Linux/X11, we'll use the basic approach since direct X11 access is complex
        // The regions parameter will be used in a future implementation
        let _ = regions;
    }

    #[cfg(target_os = "windows")]
    {
        // For Windows, we'll use the basic approach for now
        let _ = regions;
    }

    #[cfg(target_os = "macos")]
    {
        // For macOS, we'll use the basic approach for now
        let _ = regions;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, create_settings_window, configure_toolbar_click_through])
        .setup(|app| {
            // Configure toolbar click-through on startup
            if let Some(toolbar_window) = app.get_webview_window("toolbar") {
                // Initial configuration will be set by frontend
                let _ = toolbar_window.set_focus();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
