// Tauri backend library for Steward AI assistant with click-through support
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{WebviewUrl, WebviewWindowBuilder, Manager};
use tauri_plugin_sql::{Migration, MigrationKind};

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
        .inner_size(1000.0, 700.0)
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_settings_table",
            sql: "CREATE TABLE settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_keybinds_table", 
            sql: "CREATE TABLE keybinds (
                key_combination TEXT PRIMARY KEY,
                command TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:steward.db", migrations)
                .build()
        )
        .invoke_handler(tauri::generate_handler![greet, create_settings_window])
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
