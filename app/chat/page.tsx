"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader, AlertCircle, Heart, Smile, Frown, Meh } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  emotion?: string
  emotionConfidence?: number
  suggestions?: string[]
}

interface EmotionData {
  primary: string
  confidence: number
  suggestions: string[]
}

const emotionIcons: Record<string, React.ReactNode> = {
  happy: <Smile className="w-5 h-5 text-yellow-500" />,
  sad: <Frown className="w-5 h-5 text-blue-500" />,
  anxious: <AlertCircle className="w-5 h-5 text-orange-500" />,
  calm: <Heart className="w-5 h-5 text-green-500" />,
  neutral: <Meh className="w-5 h-5 text-gray-500" />,
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setError("")
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          userMessage: input,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      console.log("[v0] API Response:", data)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I understand. How are you feeling right now?",
        emotion: data.emotion?.primary,
        emotionConfidence: data.emotion?.confidence,
        suggestions: data.suggestions,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setEmotionData(data.emotion)
    } catch (err) {
      console.error("[v0] Chat error:", err)
      setError("Failed to get response. Please try again.")
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6 bg-card">
          <h1 className="text-2xl font-bold text-foreground">Mindwell Companion</h1>
          <p className="text-muted-foreground">Your supportive AI mental wellness companion</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Mindwell</h2>
                <p className="text-muted-foreground mb-4">Start a conversation to begin your wellness journey</p>
                <p className="text-sm text-muted-foreground">
                  Your emotions will be detected in real-time, and personalized wellness suggestions will be provided.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.emotion && (
                  <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-2">
                    <span className="text-xs font-medium">Detected: {message.emotion}</span>
                    {emotionIcons[message.emotion.toLowerCase()] || null}
                    {message.emotionConfidence && (
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(message.emotionConfidence * 100)}%)
                      </span>
                    )}
                  </div>
                )}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <p className="text-xs font-semibold mb-2">Suggested Actions:</p>
                    <ul className="text-xs space-y-1">
                      {message.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Analyzing...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-6 bg-card">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your feelings..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Emotion Sidebar */}
      <div className="hidden lg:block w-80 border-l border-border bg-card p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Session Insights</h3>

        {emotionData ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Primary Emotion</p>
              <div className="flex items-center gap-3">
                <div className="text-4xl">{emotionIcons[emotionData.primary.toLowerCase()] || "😐"}</div>
                <div>
                  <p className="font-semibold text-foreground">{emotionData.primary}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(emotionData.confidence * 100)}% confidence
                  </p>
                </div>
              </div>
            </div>

            {emotionData.suggestions && emotionData.suggestions.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-3">Wellness Suggestions</p>
                <div className="space-y-2">
                  {emotionData.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Chat to see emotion insights</p>
          </div>
        )}
      </div>
    </div>
  )
}
