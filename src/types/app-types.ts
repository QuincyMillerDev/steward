export type AppState = "idle" | "listening" | "processing" | "waiting-confirmation" | "settings" | "help"

export interface ConfirmationAction {
  id: string
  description: string
  command: string
}

export interface AppStateType {
  currentState: AppState
  isResponseVisible: boolean
  responseContent: string
  confirmationAction: ConfirmationAction | null
  audioLevel: number
  position: { x: number; y: number }
}

export type AppAction =
  | { type: "START_LISTENING" }
  | { type: "STOP_LISTENING" }
  | { type: "START_PROCESSING" }
  | { type: "SHOW_RESPONSE"; content: string }
  | { type: "REQUEST_CONFIRMATION"; action: ConfirmationAction }
  | { type: "CONFIRM_ACTION"; approved: boolean; dontAskAgain?: boolean }
  | { type: "REJECT_AND_RESTART" }
  | { type: "DISMISS_RESPONSE" }
  | { type: "OPEN_SETTINGS" }
  | { type: "OPEN_HELP" }
  | { type: "CLOSE_MODAL" }
  | { type: "UPDATE_AUDIO_LEVEL"; level: number }
  | { type: "UPDATE_POSITION"; position: { x: number; y: number } }