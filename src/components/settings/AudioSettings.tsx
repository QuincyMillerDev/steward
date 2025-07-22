// Audio settings component for microphone and audio configuration
import { useState } from 'react';

export default function AudioSettings() {
  const [microphoneSensitivity, setMicrophoneSensitivity] = useState(75);
  const [pushToTalk, setPushToTalk] = useState(false);
  const [pushToTalkKey, setPushToTalkKey] = useState('Space');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Audio Settings</h2>
        <p className="text-sm text-text-secondary">
          Configure microphone and audio input preferences for optimal voice recognition
        </p>
      </div>

      <div className="space-y-6">
        {/* Microphone Sensitivity */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Microphone Sensitivity
          </label>
          <div className="bg-primary/50 rounded-lg p-4">
            <div className="flex items-center space-x-4 mb-2">
              <input
                type="range"
                min="0"
                max="100"
                value={microphoneSensitivity}
                onChange={(e) => setMicrophoneSensitivity(Number(e.target.value))}
                className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <span className="text-sm text-text-primary font-medium w-12 text-right">
                {microphoneSensitivity}%
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Higher sensitivity picks up quieter voices but may also capture background noise
            </p>
          </div>
        </div>

        {/* Push-to-Talk Settings */}
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={pushToTalk}
              onChange={(e) => setPushToTalk(e.target.checked)}
              className="h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-accent focus:ring-offset-0 bg-primary/50"
            />
            <span className="text-sm text-text-primary font-medium">Enable push-to-talk</span>
          </label>
          <p className="text-xs text-text-secondary -mt-2 ml-7">
            Hold a key to activate voice input instead of continuous listening
          </p>

          {pushToTalk && (
            <div className="ml-7 space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Push-to-Talk Key
                </label>
                <select
                  value={pushToTalkKey}
                  onChange={(e) => setPushToTalkKey(e.target.value)}
                  className="w-full rounded-lg bg-primary/50 border border-border text-text-primary px-4 py-3 focus:border-accent focus:outline-none text-sm"
                >
                  <option value="Space">Space</option>
                  <option value="Ctrl">Ctrl</option>
                  <option value="Alt">Alt</option>
                  <option value="Shift">Shift</option>
                  <option value="F1">F1</option>
                  <option value="F2">F2</option>
                </select>
              </div>

              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-text-secondary">
                  <strong>Tip:</strong> Press and hold <kbd className="px-2 py-1 bg-primary/50 rounded text-xs font-mono">{pushToTalkKey}</kbd> while speaking, then release when done
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Audio Device Selection */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Microphone Device
          </label>
          <select className="w-full rounded-lg bg-primary/50 border border-border text-text-primary px-4 py-3 focus:border-accent focus:outline-none text-sm">
            <option>Default Microphone</option>
            <option>Headset Microphone</option>
            <option>USB Microphone</option>
            <option>System Microphone</option>
          </select>
          <p className="mt-2 text-xs text-text-secondary">
            Select which microphone to use for voice input
          </p>
        </div>
      </div>
    </div>
  );
}