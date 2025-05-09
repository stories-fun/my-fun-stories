"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Copy,
  Clipboard,
  Wand2,
  Edit,
  Highlighter,
  Undo,
  Redo,
  Link,
  MessageSquare,
  Download,
  Save,
  FileUp,
  User,
} from "lucide-react"
import { Button } from "../_components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar } from "../../components/ui/avatar"
import { Textarea } from "../../components/ui/textarea"
import NavBar from "../_components/NavBar"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [storyCard, setStoryCard] = useState<string | null>(null)
  const [longStory, setLongStory] = useState<string | null>(null)
  const [promptCount, setPromptCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (promptCount >= 3) handleGenerateStory()
  }, [promptCount])

  const handleSendMessage = async (e: React.FormEvent) => {
    const localuser = localStorage.getItem("userId")
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setPromptCount((count) => count + 1)

    try {
      const response = await fetch("/api/text-to-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: input,
          userId: localuser,
          conversationId,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.error ?? "Failed to get response")

      const assistantMessage: Message = {
        id: Date.now().toString() + "_assistant",
        role: "assistant",
        content: data.aiResponse,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setConversationId(data.conversationId)
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_error",
          role: "assistant",
          content: `Error: ${err.message}`,
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateStory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/text-to-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: "Please generate the final story.",
          userId: 
          conversationId,
          generateStory: true,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.error ?? "Failed to get story")

      const parts = data.aiResponse.split("LONG STORY:")
      setStoryCard(parts[0]?.trim() || "")
      setLongStory(parts[1]?.trim() || "")

      const assistantMessage: Message = {
        id: Date.now().toString() + "_story",
        role: "assistant",
        content: "Final story generated.",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <main className="flex-1 flex bg-blue-50 p-6">
        <div className="w-1/2 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="flex items-start">
                  <Avatar className="mr-2">
                    {message.role === "assistant" ? (
                      <img src="/placeholder.svg?key=chatbot" alt="ChatBot" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{message.role === "assistant" ? "ChatBot" : "You"}</div>
                    <div className="text-sm mt-1 whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-sm text-gray-500 italic">Generating response...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 flex items-center gap-2">
            <form onSubmit={handleSendMessage} className="flex w-full items-end relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your message"
                className="resize-none w-full pr-16"
                rows={1}
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="absolute right-2 bottom-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                disabled={isLoading}
              >
                Send
              </Button>
            </form>
            <Button onClick={handleGenerateStory} disabled={isLoading} className="text-sm">
              Generate Final Story
            </Button>
          </div>
        </div>

        <div className="w-1/2 ml-6 bg-white rounded-lg shadow-sm overflow-y-auto p-6">
        <div className="w-9/10 ml-6 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Story Editor</h2>
            <Button
              onClick={() => alert("Story published successfully!")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Publish Story
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <input
                type="text"
                value={storyCard || "Untitled Story"}
                onChange={(e) => setStoryCard(e.target.value)}
                className="w-full text-2xl font-bold mb-4 border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter story title..."
              />

              <Textarea
                value={longStory || ""}
                onChange={(e) => setLongStory(e.target.value)}
                className="w-full min-h-[500px] resize-none border-0 focus:ring-0 p-0"
                placeholder="Your story will appear here after generation. You can edit it directly in this area."
              />
            </div>
          </div>

          <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {longStory ? `${longStory.length} characters` : "No content yet"}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center space-x-1">
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}