import { useReducer } from "react"
import type { AppStateType, AppAction } from "../types/app-types"

const initialState: AppStateType = {
  currentState: "idle",
  isResponseVisible: false,
  responseContent: "",
  confirmationAction: null,
  audioLevel: 0,
  position: { x: 100, y: 100 },
}

function appReducer(state: AppStateType, action: AppAction): AppStateType {
  switch (action.type) {
    case "START_LISTENING":
      return {
        ...state,
        currentState: "listening",
        audioLevel: 0,
      }

    case "STOP_LISTENING":
      return {
        ...state,
        currentState: "idle",
        audioLevel: 0,
      }

    case "START_PROCESSING":
      return {
        ...state,
        currentState: "processing",
        audioLevel: 0,
        isResponseVisible: true,
        responseContent: "",
      }

    case "SHOW_RESPONSE":
      return {
        ...state,
        currentState: "idle",
        isResponseVisible: true,
        responseContent: action.content,
      }

    case "REQUEST_CONFIRMATION":
      return {
        ...state,
        currentState: "waiting-confirmation",
        confirmationAction: action.action,
        isResponseVisible: true,
      }

    case "CONFIRM_ACTION":
      return {
        ...state,
        currentState: "processing",
        confirmationAction: null,
      }

    case "REJECT_AND_RESTART":
      return {
        ...state,
        currentState: "idle",
        confirmationAction: null,
        isResponseVisible: false,
        responseContent: "",
      }

    case "DISMISS_RESPONSE":
      return {
        ...state,
        isResponseVisible: false,
        responseContent: "",
        confirmationAction: null,
      }

    case "OPEN_SETTINGS":
      return {
        ...state,
        currentState: "settings",
      }

    case "OPEN_HELP":
      return {
        ...state,
        currentState: "help",
      }

    case "CLOSE_MODAL":
      return {
        ...state,
        currentState: "idle",
      }

    case "UPDATE_AUDIO_LEVEL":
      return {
        ...state,
        audioLevel: action.level,
      }

    case "UPDATE_POSITION":
      return {
        ...state,
        position: action.position,
      }

    default:
      return state
  }
}

export function useAppState() {
  return useReducer(appReducer, initialState)
}