// Reusable Button component using Headless UI
import { Button as HeadlessButton } from "@headlessui/react"
import { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
  title?: string
}

export default function Button({ 
  children, 
  onClick, 
  variant = "secondary", 
  size = "md", 
  disabled = false,
  className = "",
  type = "button",
  title
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "bg-accent text-text-primary hover:bg-accent/90 active:bg-accent/80",
    secondary: "bg-secondary text-text-primary border border-border hover:bg-border active:bg-border/80",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-secondary/50 active:bg-secondary/80"
  }
  
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs rounded-md",
    md: "px-3 py-2 text-sm rounded-md", 
    lg: "px-4 py-2.5 text-base rounded-lg"
  }

  return (
    <HeadlessButton
      onClick={onClick}
      disabled={disabled}
      type={type}
      title={title}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </HeadlessButton>
  )
}