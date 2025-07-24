import { useState } from "react"
import SettingsSection from "../settings/SettingsSection"
import SettingsField from "../settings/SettingsField"
import Switch from "../ui/Switch"
import Listbox from "../ui/Listbox"

export default function AudioTab() {
  const [microphoneSensitivity, setMicrophoneSensitivity] = useState(75)
  const [pushToTalk, setPushToTalk] = useState(false)
  const [pushToTalkKey, setPushToTalkKey] = useState("Space")
  const [microphoneDevice, setMicrophoneDevice] = useState("Default Microphone")

  const pushToTalkKeys = [
    { value: "Space", label: "Space" },
    { value: "Ctrl", label: "Ctrl" },
    { value: "Alt", label: "Alt" },
    { value: "Shift", label: "Shift" },
    { value: "F1", label: "F1" },
    { value: "F2", label: "F2" },
  ]

  const microphoneDevices = [
    { value: "Default Microphone", label: "Default Microphone" },
    { value: "Headset Microphone", label: "Headset Microphone" },
    { value: "USB Microphone", label: "USB Microphone" },
    { value: "System Microphone", label: "System Microphone" },
  ]

  return (
    <SettingsSection title="Audio Settings" description="Configure microphone and audio input preferences">
      <SettingsField 
        label="Microphone Sensitivity" 
        description="Higher sensitivity picks up quieter voices but may capture background noise"
      >
        <div className="bg-secondary rounded-lg p-4 border border-border">
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={microphoneSensitivity}
              onChange={(e) => setMicrophoneSensitivity(Number(e.target.value))}
              className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <span className="text-sm text-text-primary font-medium w-12 text-right">{microphoneSensitivity}%</span>
          </div>
        </div>
      </SettingsField>

      <Switch
        checked={pushToTalk}
        onChange={setPushToTalk}
        label="Push-to-talk"
        description="Hold a key to activate voice input"
      />

      {pushToTalk && (
        <div className="ml-0 space-y-3 bg-secondary/50 rounded-lg p-4 border border-border">
          <SettingsField label="Push-to-Talk Key">
            <Listbox 
              value={pushToTalkKey} 
              onChange={setPushToTalkKey}
              options={pushToTalkKeys}
              placeholder="Select key"
            />
          </SettingsField>
          <div className="bg-accent/10 rounded-md p-3">
            <p className="text-xs text-text-secondary">
              <strong>Tip:</strong> Press and hold{" "}
              <kbd className="px-1.5 py-0.5 bg-border rounded text-xs font-mono text-text-primary">
                {pushToTalkKey}
              </kbd>{" "}
              while speaking
            </p>
          </div>
        </div>
      )}

      <SettingsField 
        label="Microphone Device" 
        description="Select which microphone to use for voice input"
      >
        <Listbox 
          value={microphoneDevice} 
          onChange={setMicrophoneDevice}
          options={microphoneDevices}
          placeholder="Select device"
        />
      </SettingsField>
    </SettingsSection>
  )
}
