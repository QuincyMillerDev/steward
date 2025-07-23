# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Steward is an AI Agent desktop assistant for interacting with your own desktop environment with natural language with Tauri 2.0 + React + TypeScript. The application provides voice-controlled desktop automation through a floating overlay toolbar.

## Development Commands

### Frontend (React/TypeScript)
- `bun run dev` - Start Vite dev server for frontend
- `bun run build` - Build frontend for production
- `bun run preview` - Preview production build

### Tauri Desktop App
- `bun run tauri dev` - Start Tauri dev mode (runs frontend + backend)
- `bun run tauri build` - Build desktop application
- `bun run tauri` - Run any Tauri CLI command

### Backend (Rust)
- Backend code is in `src-tauri/src/lib.rs`
- Tauri commands are defined in `src-tauri/src/lib.rs` using `#[tauri::command]`
- Build with: `cd src-tauri && cargo build`

## Architecture

### Core Components
- **Frontend**: React + TypeScript in `/src/` directory
- **Backend**: Rust Tauri app in `/src-tauri/` directory
- **Communication**: Tauri invoke() calls from frontend to Rust commands

### Key Files
- `src/App.tsx` - Main React component (currently basic template)
- `src-tauri/src/lib.rs` - Rust backend with Tauri commands
- `src-tauri/tauri.conf.json` - Tauri configuration
- `vite.config.ts` - Vite configuration for dev server

### Planned Architecture (from TECHNICAL_REQUIREMENTS.md)
```
User Voice → Tauri (Rust) → Python (AI Decision) → Tauri (Rust Execution)
                ↑                                           ↓
            Screenshot                                   enigo Actions
```

### AI Integration
- Python FASTAPI + Langchain sidecar (not yet implemented)
- Rust `enigo` library for desktop automation (to be added)

## Development Setup

1. Install dependencies: `bun install`
2. Start dev mode: `bun run tauri dev`
3. Access app at `http://localhost:1420`

## Data Storage
- **Location**: `~/.steward/` (cross-platform)
- **Engine**: SQLite for session history
- **Formats**: JSONL summaries, PNG screenshots, Markdown context
- **Retention**: 7-day screenshots, 30-day conversations
- **Size cap**: 200MB total with auto-cleanup

## Target Features (MVP)
- Floating overlay toolbar with 3 max buttons
- Push-to-talk voice input
- Screenshot + voice → AI action commands
- Basic automation: mouse clicks, typing, browser navigation
- Safety confirmation prompts
- Local data storage (no cloud sync)

## Code Style Guidelines
- Always add a comment to the top of every file with a 1 line description of the file.

## Context & Time
- The year is 2025. For any time-specific queries, like using perplexity-ask or web search, make sure you specify that the current year is 2025.