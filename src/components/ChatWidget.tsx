import React, { useState, useEffect, useRef, useCallback } from "react"
import { ChatbotConfig, Message } from "../types"
import { ChatbotAPI } from "../api"
import { ChatHeader } from "./ChatHeader"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"

interface ChatWidgetProps {
  config: ChatbotConfig
  isOpen: boolean
  isMinimized: boolean
  onClose: () => void
  onMinimize: () => void
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ config, isOpen, isMinimized, onClose, onMinimize }) => {
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
  
  // Không hiển thị nội dung chat khi ở chế độ thu nhỏ
  if (isMinimized) return null

  const position = config.position || "bottom-right"
  const positionClasses = {
    "bottom-right": "bottom-20 right-4",
    "bottom-left": "bottom-20 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  return (
    <div
      className={`cyhome-chatbox ${isOpen ? 'open' : ''} fixed ${positionClasses[position]}`}
      style={{
        backgroundColor: config.theme?.backgroundColor || "#ffffff",
      }}
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
        className="cyhome-messages-container"
      >
        {isLoadingMore && (
          <div className="cyhome-loading">
            <div className="cyhome-loading-dots">
              <span className="cyhome-loading-dot"></span>
              <span className="cyhome-loading-dot"></span>
              <span className="cyhome-loading-dot"></span>
            </div>
            <span>Đang tải tin nhắn cũ...</span>
          </div>
        )}
        
        {isLoading && (
          <div className="cyhome-loading">
            <div className="cyhome-loading-dots">
              <span className="cyhome-loading-dot"></span>
              <span className="cyhome-loading-dot"></span>
              <span className="cyhome-loading-dot"></span>
            </div>
            <span>Đang nhập...</span>
          </div>
        )}

        {messages.length === 0 && !isLoadingMore ? (
          <div className="cyhome-welcome-message">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <p className="text-base">{config.welcomeMessage || "Chào mừng bạn đến với CyHome Support!"}</p>
            <p className="text-sm mt-2 opacity-75">Hãy gửi tin nhắn để bắt đầu trò chuyện</p>
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
