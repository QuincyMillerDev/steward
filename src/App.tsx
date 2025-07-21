
function App() {
  return (
    <div className="min-h-screen bg-primary text-text-primary p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Steward AI Desktop Assistant
          </h1>
          <p className="text-lg text-text-secondary text-center">
            Your intelligent desktop companion for elderly users
          </p>
        </header>
        
        <main className="space-y-8">
          <div className="card text-center">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-readable text-text-secondary mb-6">
              Welcome to Steward! This is a clean slate React application with TailwindCSS 
              configured for elderly-friendly design patterns.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn-primary clickable-area">
                Primary Button
              </button>
              <button className="btn-secondary clickable-area">
                Secondary Button
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Features Ready</h3>
              <ul className="space-y-2 text-readable">
                <li>✅ TailwindCSS with elderly-friendly themes</li>
                <li>✅ Headless UI components available</li>
                <li>✅ Tauri 2.0 desktop integration</li>
                <li>✅ TypeScript configuration</li>
                <li>✅ Accessibility-first design system</li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Next Steps</h3>
              <ul className="space-y-2 text-readable">
                <li>🔧 Implement floating overlay toolbar</li>
                <li>🎤 Add voice input functionality</li>
                <li>🤖 Integrate AI processing pipeline</li>
                <li>📱 Build responsive component library</li>
                <li>🎨 Add theme switching system</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
