"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface RotatingWordProps {
  words: string[]
  intervalMs?: number
  className?: string
}

export function RotatingWord({ words, intervalMs = 2400, className }: RotatingWordProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (words.length <= 1) return

    const interval = window.setInterval(() => {
      setVisible(false)
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % words.length)
        setVisible(true)
      }, 180)
    }, intervalMs)

    return () => window.clearInterval(interval)
  }, [intervalMs, words.length])

  return (
    <span className={cn("inline-flex min-w-[10ch] justify-start", className)}>
      <span
        className={cn(
          "inline-block transition-all duration-200",
          visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        )}
      >
        {words[index]}
      </span>
    </span>
  )
}
