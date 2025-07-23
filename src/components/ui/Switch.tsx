// Reusable Switch component using Headless UI
import { Switch as HeadlessSwitch } from "@headlessui/react"

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

export default function Switch({ 
  checked, 
  onChange, 
  label, 
  description, 
  disabled = false,
  className = ""
}: SwitchProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {(label || description) && (
        <div>
          {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
          {description && <p className="text-xs text-text-secondary">{description}</p>}
        </div>
      )}
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="group relative inline-flex h-5 w-9 items-center rounded-full bg-border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary data-[checked]:bg-accent data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
      >
        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 group-data-[checked]:translate-x-4 translate-x-0.5" />
      </HeadlessSwitch>
    </div>
  )
}