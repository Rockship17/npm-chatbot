import React, { useState, useEffect, useRef, useCallback } from "react"
import { ChatbotConfig, Message } from "../types"
import { ChatbotAPI } from "../api"
import { ChatHeader } from "./ChatHeader"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"

interface ChatWidgetProps {
  config: ChatbotConfig
  isOpen: boolean
  onClose: () => void
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ config, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string>("")
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const api = useRef(new ChatbotAPI(config.apiBaseUrl))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = useCallback(
    async (loadMore = false) => {
      try {
        if (loadMore) {
          setIsLoadingMore(true)
        }

        const response = await api.current.getMessages(config.platformUserId, loadMore ? cursor : undefined)

        if (response.data.message.length > 0) {
          // Reverse messages to show oldest first
          const sortedMessages = [...response.data.message].reverse()

          if (loadMore) {
            setMessages((prev) => [...sortedMessages, ...prev])
          } else {
            setMessages(sortedMessages)
            setConversationId(response.data.conversation_id)
          }

          setCursor(response.paging.NextCursor)
          setHasMore(!!response.paging.NextCursor)
        } else {
          setMessages([])
          setHasMore(false)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
        setMessages([])
      } finally {
        if (loadMore) {
          setIsLoadingMore(false)
        }
      }
    },
    [config.platformUserId, cursor]
  )

  const handleSendMessage = async (message: string) => {
    if (isLoading) return

    setIsLoading(true)

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      conversation_id: conversationId || "",
      content: message,
      type: "user",
      token_usage: 0,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await api.current.sendMessage(message, config.userName, config.platformUserId)

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: conversationId || "",
        content: response.data.ai_response,
        type: "assistant",
        token_usage: response.data.token_usage,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Get conversation ID if not set
      if (!conversationId) {
        try {
          const convResponse = await api.current.getConversation(config.platformUserId)
          setConversationId(convResponse.data.id)
        } catch (error) {
          console.error("Error getting conversation:", error)
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Remove user message on error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearConversation = async () => {
    if (!conversationId || isClearing) return

    setIsClearing(true)
    try {
      await api.current.clearConversation(conversationId)
      setMessages([])
      setConversationId(null)
      setCursor("")
      setHasMore(true)
    } catch (error) {
      console.error("Error clearing conversation:", error)
    } finally {
      setIsClearing(false)
    }
  }

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container || isLoadingMore || !hasMore) return

    if (container.scrollTop === 0) {
      loadMessages(true)
    }
  }, [isLoadingMore, hasMore, loadMessages])

  useEffect(() => {
    if (isOpen && !initialized) {
      loadMessages()
      setInitialized(true)
    }
  }, [isOpen, initialized, loadMessages])

  useEffect(() => {
    if (messages.length > 0 && !isLoadingMore) {
      scrollToBottom()
    }
  }, [messages, isLoadingMore])

  if (!isOpen) return null

  const position = config.position || "bottom-right"
  const positionClasses = {
    "bottom-right": "bottom-20 right-4",
    "bottom-left": "bottom-20 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} w-80 h-96 bg-white rounded-lg shadow-2xl border flex flex-col z-50`}
      style={{ maxHeight: "500px" }}
    >
      <ChatHeader
        userName={config.userName}
        onClose={onClose}
        onClear={handleClearConversation}
        isClearing={isClearing}
        theme={config.theme}
      />

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        style={{ minHeight: 0 }}
      >
        {isLoadingMore && (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="32"
                  strokeDashoffset="32"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    dur="2s"
                    values="0 32;16 16;0 32;0 32"
                    repeatCount="indefinite"
                  />
                  <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite" />
                </circle>
              </svg>
              Đang tải tin nhắn cũ...
            </div>
          </div>
        )}

        {messages.length === 0 && !isLoadingMore ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              <p className="text-sm">{config.welcomeMessage || "Chào mừng bạn đến với CyHome Support!"}</p>
              <p className="text-xs mt-1 opacity-75">Hãy gửi tin nhắn để bắt đầu trò chuyện</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} theme={config.theme} />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={config.theme} />
    </div>
  )
}
