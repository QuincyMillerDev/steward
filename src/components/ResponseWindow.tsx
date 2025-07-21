import type React from "react"
import { IconX, IconCheck, IconRotateClockwise } from "@tabler/icons-react"
import type { AppStateType, AppAction } from "../types/app-types"

interface ResponseWindowProps {
  state: AppStateType
  dispatch: React.Dispatch<AppAction>
}

export function ResponseWindow({ state, dispatch }: ResponseWindowProps) {
  if (!state.isResponseVisible && state.currentState !== "processing") return null

  const handleConfirmAction = (approved: boolean, dontAskAgain = false) => {
    dispatch({ type: "CONFIRM_ACTION", approved, dontAskAgain })
    // TODO: Replace with actual Tauri command
    // await invoke('confirm_action', { approved, dontAskAgain })
  }

  const handleRejectAndRestart = () => {
    dispatch({ type: "REJECT_AND_RESTART" })
    // TODO: Replace with actual Tauri command
    // await invoke('reject_and_restart')
  }

  const isStreaming = state.currentState === "processing"

  return (
    <div
      className="fixed z-40 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl transition-all duration-200"
      style={{
        left: "0px",
        top: "80px",
        width: "420px",
        maxHeight: "400px",
        minHeight: "120px",
      }}
    >
      {/* Header with minimal Steward branding */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-xs font-medium text-gray-400">Steward</span>
        </div>
        
        {/* Close button */}
        <button
          onClick={() => dispatch({ type: "DISMISS_RESPONSE" })}
          className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="Close response"
        >
          <IconX className="w-3 h-3" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 pr-4 max-h-64 overflow-y-auto">
        {isStreaming ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm font-medium">Thinking...</span>
          </div>
        ) : (
          <p className="text-gray-100 text-base leading-relaxed">{state.responseContent}</p>
        )}
      </div>

      {/* Confirmation Actions */}
      {state.confirmationAction && (
        <div className="p-4 border-t border-gray-800 bg-gray-800/50 rounded-b-2xl">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-100 mb-2">I want to:</p>
            <p className="text-sm text-gray-100 bg-gray-950 p-3 rounded-lg leading-relaxed border border-gray-800">
              {state.confirmationAction.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleConfirmAction(true)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-500/90 active:bg-blue-500/80 text-white rounded-lg transition-all duration-200 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <IconCheck className="w-4 h-4" />
              Yes, approve
            </button>

            <button
              onClick={() => handleConfirmAction(true, true)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gray-700 hover:bg-gray-700/90 active:bg-gray-700/80 text-white rounded-lg transition-all duration-200 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <IconCheck className="w-4 h-4" />
              Yes, and don't ask again
            </button>

            <button
              onClick={handleRejectAndRestart}
              className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-500/90 active:bg-amber-500/80 text-white rounded-lg transition-all duration-200 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <IconRotateClockwise className="w-4 h-4" />
              No, let me tell you what to do
            </button>
          </div>
        </div>
      )} 
    </div>
  )
}