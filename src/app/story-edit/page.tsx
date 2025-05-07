"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Bell,
  Wallet,
  User,
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
} from "lucide-react"
import { Button } from "../_components/ui/button"
import { Input } from "../_components/ui/input"
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
  const [storyTitle, setStoryTitle] = useState("The Glass Tower: A Tale of a Grand Hotel")
  const [storyContent, setStoryContent] = useState(
    "Once upon a time in the vibrant heart of a coastal city stood The Glass Tower - a magnificent hotel that seemed to touch the clouds. Its facade was a masterpiece of modern architecture, with walls of reflective glass that captured the sky and sea in their ever-changing glory. 🏢\n\nThe Glass Tower wasn't just any hotel; it was a world unto itself. The lobby featured marble floors that gleamed beneath crystal chandeliers, with staff in impeccable uniforms greeting guests with warm smiles and genuine hospitality. 👨‍💼\n\nHelena Rodriguez had been the hotel's general manager for fifteen years. She knew every inch of the property, from the underground service tunnels to the exclusive penthouse suite. Her day began before sunrise, reviewing reports and preparing for the arrival of a celebrity chef who would be opening a new restaurant in the hotel. 👩‍💼\n\nAs she sipped her morning coffee in her office overlooking the bay, she received an unexpected call. The hotel's most loyal guest, Mr. Yamamoto, who had stayed at The Glass Tower every month for the past decade, had passed away. His last wish was to have his ashes scattered from the hotel's rooftop garden - his favorite place in the world! 🌆\n\nTouched and honored, Helena made arrangements for a private ceremony. She invited the staff who had known Mr. Yamamoto best: Carlos the doorman who always greeted him by name, Maria the housekeeper who knew exactly how he liked his pillows arranged, and James the bartender who had his martini ready before he even sat down. 🍸\n\nMeanwhile, in room 712, newlyweds Sophie and Daniel were beginning their honeymoon, blissfully unaware of the small dramas unfolding around them. They had saved for years to afford this luxury, and everything about The Glass Tower exceeded their expectations. 💑\n\nOn the fourth floor, bestselling author Eliza Moore was battling writer's block. She had checked in three weeks ago to finish her latest novel but had barely written a paragraph. The hotel's concierge, noticing her distress, arranged for her to have access to a secluded section of the beach at dawn, where she finally found her inspiration among the crashing waves. 📝🌊\n\nAs dusk fell, Helena stood on the rooftop with Mr. Yamamoto's small gathering. The city lights began to twinkle below them as they shared stories of the gentle man who had made The Glass Tower his second home. When it came time to scatter his ashes, a warm breeze carried them across the water, seemingly guiding them to the horizon. 🌅",
  )
  const [currentTab, setCurrentTab] = useState("transcript")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastModified = new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navabar */}
      <NavBar/>

      {/* Main Content */}
      <main className="flex-1 flex bg-blue-50 p-6">
        {/* Chat Section */}
        <div className="w-1/3 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="flex items-start">
                  <Avatar className="mr-2">
                    {message.role === "assistant" ? (
                      <img src="/placeholder.svg?key=exdlp" alt="ChatBot" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">{message.role === "assistant" ? "ChatBot" : "You"}</span>
                    </div>
                    <div className="mt-1 text-sm">{message.content}</div>
                    <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 mt-4">
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your message"
                className="resize-none pr-10"
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 bottom-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                disabled={isLoading}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </form>
          </div>
        </div>

        {/* Transcript Section */}
        <div className="w-2/3 ml-6 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">Transcript</h1>
            <p className="text-sm text-gray-500">Last modified {lastModified}</p>
          </div>

          <Tabs defaultValue="transcript" className="flex-1 flex flex-col">
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none border-b">
                <TabsTrigger
                  value="transcript"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                  onClick={() => setCurrentTab("transcript")}
                >
                  Transcript
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                  onClick={() => setCurrentTab("summary")}
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                  onClick={() => setCurrentTab("chat")}
                >
                  Chat
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="border-b">
              <div className="flex p-2 space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Clipboard className="h-4 w-4" />
                  <span>Paste</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Wand2 className="h-4 w-4" />
                  <span>AI</span>
                </Button>
                <div className="h-6 border-l border-gray-300"></div>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Highlighter className="h-4 w-4" />
                  <span>Highlight</span>
                </Button>
                <div className="h-6 border-l border-gray-300"></div>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Undo className="h-4 w-4" />
                  <span>Undo</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Redo className="h-4 w-4" />
                  <span>Redo</span>
                </Button>
                <div className="h-6 border-l border-gray-300"></div>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Link className="h-4 w-4" />
                  <span>Link</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comment</span>
                </Button>
                <div className="h-6 border-l border-gray-300"></div>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <FileUp className="h-4 w-4" />
                  <span>Find in Page</span>
                </Button>
              </div>
            </div>

            <TabsContent value="transcript" className="flex-1 p-6 overflow-y-auto">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-4">{storyTitle} 🏨</h2>
                <div className="whitespace-pre-line">{storyContent}</div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="flex-1 p-6 overflow-y-auto">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium mb-2">Story Summary</h3>
                <p>
                  This is a tale about The Glass Tower, a luxurious hotel by the coast. It follows several characters
                  including Helena Rodriguez (the manager), Mr. Yamamoto (a loyal guest who passed away), newlyweds
                  Sophie and Daniel, and author Eliza Moore. The story culminates in a ceremony to scatter Mr.
                  Yamamoto's ashes from his favorite place - the hotel's rooftop garden.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium">AI Assistant</p>
                  <p className="mt-1">
                    I've created a story about a luxury hotel called The Glass Tower. Would you like me to continue the
                    story or modify any parts of it?
                  </p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="font-medium">You</p>
                  <p className="mt-1">Can you add a mysterious event that happens at the hotel?</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium">AI Assistant</p>
                  <p className="mt-1">
                    I've added a mysterious power outage scene where guests report seeing strange lights on the 13th
                    floor - a floor that doesn't officially exist in the hotel's plans. Would you like me to develop
                    this mystery further?
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
