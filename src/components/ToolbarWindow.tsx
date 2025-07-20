import type React from "react"
import { useState, useRef } from "react"
import { IconMicrophone, IconSettings, IconPlayerStop, IconX } from "@tabler/icons-react"
import { WaveformAnimation } from "./WaveformAnimation"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { invoke } from "@tauri-apps/api/core"
import type { AppStateType, AppAction } from "../types/app-types"

interface ToolbarWindowProps {
  state: AppStateType
  dispatch: React.Dispatch<AppAction>
}

export function ToolbarWindow({ state, dispatch }: ToolbarWindowProps) {
  const toolbarRef = useRef<HTMLDivElement>(null)

  const handleDragStart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only start dragging on left mouse button
    if (e.button !== 0) return
    
    try {
      const window = getCurrentWindow()
      await window.startDragging()
    } catch (error) {
      console.error("Failed to start dragging:", error)
    }
  }


  const handleOpenSettings = async () => {
    try {
      await invoke("open_settings_window")
    } catch (error) {
      console.error("Failed to open settings window:", error)
      // Fallback to modal
      dispatch({ type: "OPEN_SETTINGS" })
    }
  }

  const handleCloseApp = async () => {
    try {
      const window = getCurrentWindow()
      await window.close()
    } catch (error) {
      console.error("Failed to close app:", error)
    }
  }


  // Tauri integration points
  const handleMicClick = async () => {
    if (state.currentState === "listening") {
      dispatch({ type: "STOP_LISTENING" })
      // TODO: Replace with actual Tauri command
      // await invoke('stop_listening')
    } else {
      dispatch({ type: "START_LISTENING" })
      // TODO: Replace with actual Tauri command
      // await invoke('start_listening')
    }
  }

  const handleStopAgent = async () => {
    dispatch({ type: "STOP_LISTENING" })
    // TODO: Replace with actual Tauri command
    // await invoke('stop_agent')
  }


  const getMicButtonContent = () => {
    switch (state.currentState) {
      case "listening":
        return <WaveformAnimation isActive={true} audioLevel={state.audioLevel} />
      case "processing":
        return <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
      default:
        return <IconMicrophone className="w-6 h-6" />
    }
  }

  const showStopButton = state.currentState === "processing" || state.currentState === "waiting-confirmation"

  return (
    <div
      ref={toolbarRef}
      className="flex items-center bg-white/95 dark:bg-[hsl(var(--card))] backdrop-blur-md border border-[hsl(var(--border))] rounded-2xl shadow-lg transition-all duration-200 w-full h-[60px] overflow-hidden"
    >
      {/* Drag Handle */}
      <div
        className="flex items-center justify-center w-12 h-full cursor-grab active:cursor-grabbing rounded-l-2xl select-none transition-colors duration-200"
        onMouseDown={handleDragStart}
        role="button"
        tabIndex={0}
        aria-label="Drag to move toolbar"
      >
        <div className="grid grid-cols-3 gap-1 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-[hsl(var(--muted-foreground))] rounded-full" />
          ))}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-3 px-4 flex-1">
        {/* Stop Button (conditional, left of microphone) */}
        {showStopButton && (
          <button
            onClick={handleStopAgent}
            className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ease-in-out bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/90 active:bg-[hsl(var(--destructive))]/80 text-[hsl(var(--destructive-foreground))] shadow-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:ring-offset-2"
            aria-label="Stop Steward"
          >
            <IconPlayerStop className="w-6 h-6" />
          </button>
        )}

        {/* Microphone Button - Centered */}
        <button
          onClick={handleMicClick}
          disabled={state.currentState === "processing"}
          className={`
            flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ease-in-out
            ${
              state.currentState === "listening"
                ? "bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/90 active:bg-[hsl(var(--destructive))]/80 text-[hsl(var(--destructive-foreground))] shadow-lg"
                : "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 active:bg-[hsl(var(--primary))]/80 text-[hsl(var(--primary-foreground))] shadow-lg"
            }
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-opacity-100
            focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:ring-offset-2
          `}
          aria-label={state.currentState === "listening" ? "Stop listening" : "Start listening"}
        >
          {getMicButtonContent()}
        </button>

        {/* Spacer to balance the stop button when visible */}
        {showStopButton && <div className="w-12" />}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 px-4">
        {/* Settings Button */}
        <button
          onClick={handleOpenSettings}
          className="flex items-center justify-center w-10 h-10 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] active:bg-[hsl(var(--muted))]/80 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50"
          aria-label="Open settings"
        >
          <IconSettings className="w-5 h-5" />
        </button>

        {/* Close Button */}
        <button
          onClick={handleCloseApp}
          className="flex items-center justify-center w-10 h-10 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] active:bg-[hsl(var(--muted))]/80 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50"
          aria-label="Close application"
        >
          <IconX className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}