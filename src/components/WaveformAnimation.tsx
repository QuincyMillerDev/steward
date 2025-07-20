import { useEffect, useState } from "react"

interface WaveformAnimationProps {
  isActive: boolean
  audioLevel: number
  className?: string
}

export function WaveformAnimation({ isActive, audioLevel, className = "" }: WaveformAnimationProps) {
  const [bars, setBars] = useState(Array(5).fill(0.2))

  useEffect(() => {
    if (!isActive) {
      setBars(Array(5).fill(0.2))
      return
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((_, index) => {
          const baseHeight = 0.2 + audioLevel * 0.6
          const variation = Math.random() * 0.4 - 0.2
          const phaseOffset = Math.sin(Date.now() * 0.01 + index) * 0.2
          return Math.max(0.1, Math.min(1, baseHeight + variation + phaseOffset))
        }),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [isActive, audioLevel])

  return (
    <div className={`flex items-end justify-center gap-1 ${className}`}>
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-current transition-all duration-100 ease-out rounded-full"
          style={{
            height: `${height * 16}px`,
            opacity: isActive ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}