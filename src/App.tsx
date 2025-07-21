import { useEffect } from "react";
import { useAppState } from "./hooks/use-app-state";
import { ToolbarWindow } from "./components/ToolbarWindow";
import { ResponseWindow } from "./components/ResponseWindow";
import { SettingsWindow } from "./components/SettingsWindow";
import "./styles/globals.css";

function App() {
  const [state, dispatch] = useAppState();
  
  // Check if this is a standalone page window
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');

  // Tauri event listeners - Replace with actual implementation
  useEffect(() => {
    // TODO: Set up Tauri event listeners
    // Example:
    // listen('audio_level_update', (event) => {
    //   dispatch({ type: 'UPDATE_AUDIO_LEVEL', level: event.payload })
    // })
    //
    // listen('ai_response', (event) => {
    //   dispatch({ type: 'SHOW_RESPONSE', content: event.payload })
    // })
    //
    // listen('confirmation_request', (event) => {
    //   dispatch({ type: 'REQUEST_CONFIRMATION', action: event.payload })
    // })

    return () => {
      // TODO: Clean up Tauri listeners
    };
  }, [dispatch]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault();
        if (state.currentState === "listening") {
          dispatch({ type: "STOP_LISTENING" });
        } else if (state.currentState === "idle") {
          dispatch({ type: "START_LISTENING" });
        }
      } else if (e.ctrlKey && e.code === "Comma") {
        e.preventDefault();
        dispatch({ type: "OPEN_SETTINGS" });
      } else if (e.code === "Escape") {
        e.preventDefault();
        if (state.currentState === "processing" || state.currentState === "waiting-confirmation") {
          dispatch({ type: "STOP_LISTENING" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.currentState, dispatch]);

  // Render standalone settings/help window or main toolbar interface
  if (pageParam === 'settings-help') {
    return (
      <div className="w-screen h-screen bg-gray-950 flex items-center justify-center p-4">
        <SettingsWindow dispatch={dispatch} />
      </div>
    );
  }

  // Main toolbar interface
  return (
    <div className="w-full h-[60px] bg-transparent">
      <ToolbarWindow state={state} dispatch={dispatch} />
      <ResponseWindow state={state} dispatch={dispatch} />

      {(state.currentState === "settings" || state.currentState === "help") && (
        <SettingsWindow 
          dispatch={dispatch} 
          defaultTab={state.currentState === "settings" ? "settings" : "help"} 
        />
      )}
    </div>
  );
}

export default App;
