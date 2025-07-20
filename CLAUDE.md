# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Desktop Assistant for Elderly Users** - A Tauri desktop application that provides voice-controlled computer assistance with visual context understanding. Built as a 1-month MVP targeting elderly users, focusing on 5 core scenarios.

## Architecture

**Hybrid Architecture**:
- **Frontend**: React + TypeScript + Mantine UI (elderly-friendly design)
- **Rust Backend**: Tauri commands + enigo (mouse/keyboard control)
- **Python Backend**: FastAPI + LangChain + OpenAI APIs (AI decisions only)
- **Communication**: Tauri spawns Python server, coordinates AI → Rust execution

**Key Design Principle**: Python makes AI decisions, Rust executes actions safely

## Developer Expertise

- You are an expert Tauri desktop app developer with Rust and React. You have access to perplexity-ask and should consult it for real-time up-to-date information for specific queries or documentation information. You should also consult me if you have any high-level outstanding questions such as design or software architecture. Keep code DRY and maintainable, it should also be self-documenting. Use design patterns such as factories/builders/commands or whatever else as applicable for features where it can keep code scalable. Think in terms of future success rather than racking up technical debt

## Key Commands

### Development
```bash
# Full development stack
bun run tauri dev                    # Start Tauri + React + spawn Python
bun run dev                         # Frontend only (localhost:1420)
bun run build                       # Build frontend for production
bun run tauri build                 # Build desktop installer (.exe)

# Python backend (separate terminal)
cd python-backend
python -m uvicorn main:app --reload --port 8756

# Rust development
cargo check                         # Check Rust code
cargo test                          # Run Rust tests
cargo clippy                        # Rust linter
cargo fmt                           # Format Rust code
```

### Production Build
```bash
# Step 1: Bundle Python backend
cd python-backend
pyinstaller --onefile main.py

# Step 2: Build Tauri with Python
cd ..
bun run tauri build                 # Creates ~50MB installer
```

## Project Structure

```
├── src/                          # React frontend (elderly-optimized UI)
│   ├── components/
│   │   ├── FloatingToolbar.tsx   # 3-button overlay (mic, help, stop)
│   │   ├── ConfirmDialog.tsx     # Large confirmation dialogs
│   │   └── VoiceRecorder.tsx     # Audio recording component
│   ├── api/
│   │   └── python.ts            # Python backend communication
│   └── App.tsx                  # Main app with Tauri integration
│
├── src-tauri/                   # Rust backend (action execution)
│   ├── src/
│   │   ├── lib.rs              # Tauri commands + Python spawning
│   │   ├── actions.rs          # Elderly-friendly action executor
│   │   └── screenshot.rs       # Screen capture utilities
│   └── tauri.conf.json         # Tauri configuration
│
├── python-backend/              # FastAPI + LangChain (AI decisions)
│   ├── main.py                 # FastAPI server @ localhost:8756
│   ├── agent/                  # LangChain elderly-optimized agent
│   └── requirements.txt        # Python dependencies
```

## Core Commands & APIs

### Tauri Commands (Rust → System)
```rust
#[tauri::command]
async fn capture_screenshot() -> Result<String, String>  // Base64 PNG
#[tauri::command]
async fn execute_click(x: i32, y: i32, delay_ms: u64) -> Result<String, String>
#[tauri::command]
async fn execute_type(text: String, delay_per_char_ms: u64) -> Result<String, String>
#[tauri::command]
async fn execute_scroll(direction: String, amount: i32) -> Result<String, String>
#[tauri::command]
async fn execute_key_press(key: String) -> Result<String, String>
#[tauri::command]
async fn emergency_stop() -> Result<(), String>
```

### Python Backend API
```typescript
// Frontend → Python communication
POST http://localhost:8756/process-command
{
  audio_text: string,
  screenshot: string  // base64 PNG
}

Response: {
  actions: Action[],
  explanation: string,
  needs_confirmation: boolean
}
```

### Key Integration Points
- `src-tauri/src/lib.rs` - Python server spawning + health checks
- `src/api/python.ts` - Frontend Python API client
- `python-backend/main.py` - FastAPI endpoints for AI processing

## Elderly-Focused Design

### UI Requirements
- **Minimum 48x48px** touch targets
- **24pt+ font size** for all text
- **High contrast colors** only
- **Visual + audio feedback** for all actions
- **Simple confirmation flow** with large buttons

### Safety Features
- **Every action confirmed** by user
- **Emergency stop** (move mouse to corner)
- **10-second timeout** on all actions
- **No admin privileges** required
- **Local-only** Python server

## Development Workflow

### Week-by-Week Plan
- **Week 1**: Foundation (Tauri + Python integration, basic toolbar)
- **Week 2**: Voice + Basic actions (recording, mouse/keyboard control)
- **Week 3**: AI integration (LangChain agent, confirmation flow)
- **Week 4**: Testing + Packaging (5 test scenarios, PyInstaller bundle)

### Key Dependencies
```toml
# src-tauri/Cargo.toml additions
[dependencies]
tauri = { version = "2.0", features = ["api-all"] }
screenshots = "0.8"
enigo = "0.2"
tokio = { version = "1", features = ["full"] }
```

```json
// package.json additions
{
  "dependencies": {
    "@mantine/core": "^7.0",
    "@mantine/hooks": "^7.0",
    "react-use": "^17.4"
  }
}
```

## Testing Scenarios (MVP)
1. **"Open my email"** → Navigate to Gmail
2. **"Click the blue send button"** → Identify and click UI elements
3. **"Type my name is John"** → Form filling with delays
4. **"Make the text bigger"** → Browser zoom via keyboard shortcuts
5. **"Stop stop stop"** → Emergency halt functionality

## Success Metrics
- Grandfather completes 3 daily tasks independently
- <5 seconds from voice command to action
- Zero critical errors in first week
- Single installer <60MB, no dependencies
