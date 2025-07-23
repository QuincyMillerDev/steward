// Reusable settings field component for consistent form field layout
import { ReactNode } from "react"

interface SettingsFieldProps {
  label: string
  description?: string
  children: ReactNode
  className?: string
}

export default function SettingsField({ label, description, children, className = "" }: SettingsFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>
      {children}
      {description && (
        <p className="mt-1 text-xs text-text-secondary">{description}</p>
      )}
    </div>
  )
}