import { IconHelpCircle, IconMessageCircle, IconSettings, IconVolume } from "@tabler/icons-react"

export function HelpContent() {
  return (
    <div className="space-y-8 bg-white/95 dark:bg-[hsl(var(--card))] backdrop-blur-md rounded-2xl p-6 shadow-lg">
      {/* Getting Started */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconHelpCircle className="w-6 h-6 text-[hsl(var(--primary))]" />
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Getting Started</h3>
        </div>
        <div className="space-y-4 pl-10">
          <p className="text-base text-[hsl(var(--foreground))] leading-relaxed">
            Steward helps you control your computer using voice commands. Simply click the microphone button and speak naturally.
          </p>
          <p className="text-base text-[hsl(var(--foreground))] leading-relaxed">
            Examples: "Open my email", "Click the send button", "Type my name is John"
          </p>
        </div>
      </section>

      {/* Voice Commands */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconMessageCircle className="w-6 h-6 text-[hsl(var(--secondary))]" />
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Voice Commands</h3>
        </div>
        <div className="space-y-6 pl-10">
          <div>
            <h4 className="font-semibold text-[hsl(var(--foreground))] mb-3 text-lg">Navigation</h4>
            <ul className="text-base text-[hsl(var(--foreground))] space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">• <span>"Open [app name]" - Opens applications</span></li>
              <li className="flex items-start gap-2">• <span>"Go to [website]" - Opens websites</span></li>
              <li className="flex items-start gap-2">• <span>"Click the [button name]" - Clicks buttons</span></li>
              <li className="flex items-start gap-2">• <span>"Scroll up/down" - Scrolls pages</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[hsl(var(--foreground))] mb-3 text-lg">Text Input</h4>
            <ul className="text-base text-[hsl(var(--foreground))] space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">• <span>"Type [text]" - Types text</span></li>
              <li className="flex items-start gap-2">• <span>"Make text bigger/smaller" - Adjusts zoom</span></li>
              <li className="flex items-start gap-2">• <span>"Press Enter/Escape" - Presses keys</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconVolume className="w-6 h-6 text-[hsl(var(--destructive))]" />
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Safety Features</h3>
        </div>
        <div className="space-y-4 pl-10">
          <p className="text-base text-[hsl(var(--foreground))] leading-relaxed">
            <strong className="text-[hsl(var(--destructive))]">Emergency Stop:</strong> Move your mouse to any corner of the screen or say "Stop" three times to immediately halt any action.
          </p>
          <p className="text-base text-[hsl(var(--foreground))] leading-relaxed">
            <strong className="text-[hsl(var(--primary))]">Confirmation Required:</strong> Steward will always ask before performing any action on your computer.
          </p>
          <p className="text-base text-[hsl(var(--foreground))] leading-relaxed">
            <strong className="text-[hsl(var(--secondary))]">10-Second Timeout:</strong> All actions automatically timeout if not confirmed within 10 seconds.
          </p>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconSettings className="w-6 h-6 text-[hsl(var(--accent))]" />
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Keyboard Shortcuts</h3>
        </div>
        <div className="space-y-3 pl-10">
          <div className="flex justify-between items-center">
            <span className="text-base text-[hsl(var(--foreground))] leading-relaxed">Start/Stop Listening</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-[hsl(var(--foreground))] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg">
              Ctrl + Space
            </kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base text-[hsl(var(--foreground))] leading-relaxed">Open Settings</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-[hsl(var(--foreground))] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg">
              Ctrl + ,
            </kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base text-[hsl(var(--foreground))] leading-relaxed">Stop Current Action</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-[hsl(var(--foreground))] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg">
              Escape
            </kbd>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section>
        <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-4">Tips for Best Results</h3>
        <div className="space-y-3 pl-10">
          <p className="text-base text-[hsl(var(--foreground))] leading-relaxed">• Speak clearly and at normal speed</p>
          <p className="text-base text-[hsl(var(--foreground))] leading-relaxed">• Use natural language - no special commands needed</p>
          <p className="text-base text-[hsl(var(--foreground))] leading-relaxed">• Be specific when describing buttons or elements</p>
          <p className="text-base text-[hsl(var(--foreground))] leading-relaxed">• If unsure, ask Steward to describe what's on screen</p>
        </div>
      </section>
    </div>
  )
}