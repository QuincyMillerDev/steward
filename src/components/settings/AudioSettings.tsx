import { useState } from "react"

export default function AudioSettings() {
  const [microphoneSensitivity, setMicrophoneSensitivity] = useState(75)
  const [pushToTalk, setPushToTalk] = useState(false)
  const [pushToTalkKey, setPushToTalkKey] = useState("Space")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Audio Settings</h2>
        <p className="text-sm text-text-secondary">Configure microphone and audio input preferences</p>
      </div>

      <div className="space-y-6">
        {/* Microphone Sensitivity */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">Microphone Sensitivity</label>
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-4 mb-2">
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
            <p className="text-xs text-text-secondary">
              Higher sensitivity picks up quieter voices but may capture background noise
            </p>
          </div>
        </div>

        {/* Push-to-Talk Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Push-to-talk</label>
              <p className="text-xs text-text-secondary">Hold a key to activate voice input</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushToTalk}
                onChange={(e) => setPushToTalk(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          {pushToTalk && (
            <div className="ml-0 space-y-3 bg-secondary/50 rounded-lg p-4 border border-border">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Push-to-Talk Key</label>
                <select
                  value={pushToTalkKey}
                  onChange={(e) => setPushToTalkKey(e.target.value)}
                  className="w-full rounded-md bg-primary border border-border text-text-primary px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="Space">Space</option>
                  <option value="Ctrl">Ctrl</option>
                  <option value="Alt">Alt</option>
                  <option value="Shift">Shift</option>
                  <option value="F1">F1</option>
                  <option value="F2">F2</option>
                </select>
              </div>
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
        </div>

        {/* Audio Device Selection */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Microphone Device</label>
          <select className="w-full rounded-md bg-secondary border border-border text-text-primary px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent">
            <option>Default Microphone</option>
            <option>Headset Microphone</option>
            <option>USB Microphone</option>
            <option>System Microphone</option>
          </select>
          <p className="mt-1 text-xs text-text-secondary">Select which microphone to use for voice input</p>
        </div>
      </div>
    </div>
  )
}
