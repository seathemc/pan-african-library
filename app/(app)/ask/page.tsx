"use client"

import * as React from "react"
import { Send, BookOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

const STARTER_QUESTIONS = [
  "What are the key Harlem Renaissance works?",
  "Recommend books on decolonization",
  "Tell me about Octavia Butler",
  "What should I read about African feminism?",
  "Introduce me to pan-African political thought",
  "Who are the major Caribbean writers?",
]

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  return (
    <div className={cn("flex gap-3 max-w-3xl", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1">
          <BookOpen className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words max-w-[85%]",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-3xl mr-auto">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1">
        <BookOpen className="w-4 h-4 text-primary-foreground" />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

export default function AskPage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [streamingContent, setStreamingContent] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent, isLoading])

  const handleSubmit = async (question?: string) => {
    const userMessage = question ?? input.trim()
    if (!userMessage || isLoading) return

    setInput("")
    setIsLoading(true)
    setStreamingContent("")

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }]
    setMessages(newMessages)

    // Build history excluding the message we just added
    const history = messages.map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      })

      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamingContent(fullText)
        scrollToBottom()
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fullText }])
      setStreamingContent("")
    } catch (err) {
      const errorText = err instanceof Error ? err.message : "Something went wrong"
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `I'm sorry, I encountered an error: ${errorText}` },
      ])
      setStreamingContent("")
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px"
  }

  const showStarters = messages.length === 0 && !isLoading

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex-shrink-0 pb-4 pt-2">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Ask Alexandria</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Your guide to pan-African and diaspora literature
        </p>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1"
      >
        {showStarters && (
          <div className="flex flex-col items-center justify-center h-full gap-8 py-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">How can I help you explore?</h2>
              <p className="text-muted-foreground text-sm max-w-md">
                Ask me about authors, works, themes, or movements across African
                and diaspora literature. I can recommend reading lists, explain
                historical context, and help you discover new voices.
              </p>
            </div>

            <div className="w-full max-w-2xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 text-center">
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSubmit(q)}
                    className="text-sm px-3 py-1.5 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isLoading && !streamingContent && <TypingIndicator />}

        {streamingContent && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words max-w-[85%]">
              {streamingContent}
              <span className="inline-block w-0.5 h-4 bg-foreground/60 ml-0.5 animate-pulse align-middle" />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 pt-4">
        <Card className="p-3">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={autoResize}
              onKeyDown={handleKeyDown}
              placeholder="Ask about an author, work, theme, or movement…"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground leading-relaxed min-h-[36px] max-h-[160px] py-1.5 disabled:opacity-50"
              style={{ overflow: "hidden" }}
            />
            <Button
              size="icon"
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 h-9 w-9 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 ml-0.5">
            Press <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono">Enter</kbd> to send,{" "}
            <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono">Shift+Enter</kbd> for new line
          </p>
        </Card>
      </div>
    </div>
  )
}
