// About settings component for app information
import { FaGithub, FaBook } from 'react-icons/fa';

export default function AboutSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">About Steward</h2>
        <p className="text-sm text-text-secondary">
          Steward is an AI desktop assistant designed specifically for elderly users, providing voice-controlled desktop automation through a simple and accessible interface.
        </p>
      </div>

      <div className="space-y-6">
        {/* Version Information */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-text-primary mb-2">Version Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Version:</span>
              <span className="text-text-primary">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Build:</span>
              <span className="text-text-primary">2024.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Platform:</span>
              <span className="text-text-primary">Desktop Application</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-3">Key Features</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start space-x-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Voice-controlled desktop automation</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Designed for elderly users with large text and high contrast</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Local data storage - no cloud dependencies</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Multiple visual themes for accessibility</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Safety confirmations for all actions</span>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary mb-3">Resources</h3>
          
          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors"
            >
              <FaBook className="h-4 w-4" />
              <span className="text-sm">Documentation</span>
            </a>
            
            <a
              href="#"
              className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors"
            >
              <FaGithub className="h-4 w-4" />
              <span className="text-sm">GitHub Repository</span>
            </a>
          </div>
        </div>

        {/* Legal */}
        <div className="text-xs text-text-secondary space-y-1">
          <p>© 2024 Steward AI Assistant. All rights reserved.</p>
          <p>Licensed under MIT License. Open source project.</p>
        </div>
      </div>
    </div>
  );
}