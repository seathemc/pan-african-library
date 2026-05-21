"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeSnippetProps {
  code: string
  className?: string
  preClassName?: string
}

export function CodeSnippet({ code, className, preClassName }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 h-8 gap-1.5 rounded-md border-border/70 bg-background/90 px-2.5 text-xs shadow-sm backdrop-blur"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <pre className={cn("rounded-lg border bg-background p-5 pr-24 text-sm font-mono overflow-x-auto", preClassName)}>
        {code}
      </pre>
    </div>
  )
}
