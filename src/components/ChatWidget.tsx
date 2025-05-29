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
  const [initialized, setInitialized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  // Check if apiToken is available in config
  const apiToken = config.apiToken || ''
  const api = useRef(new ChatbotAPI(apiToken, config.apiBaseUrl))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = useCallback(
    async () => {
      try {
        setIsLoading(true);
        const response = await api.current.getMessages(config.platformUserId);

        if (response.data.message && response.data.message.length > 0) {
          // Reverse messages to show oldest first
          const sortedMessages = [...response.data.message].reverse();
          setMessages(sortedMessages);
          setConversationId(response.data.conversation_id);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    },
    [config.platformUserId]
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
        content: response.data.ai_reply,
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
      await api.current.clearConversation(config.platformUserId)
      setMessages([])
      setConversationId(null)
    } catch (error) {
      console.error("Error clearing conversation:", error)
    } finally {
      setIsClearing(false)
    }
  }

  useEffect(() => {
    if (isOpen && !initialized) {
      loadMessages()
      setInitialized(true)
    }
  }, [isOpen, initialized, loadMessages])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

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
      className={`rockship-chatbox ${isOpen ? "open" : ""} fixed ${positionClasses[position]}`}
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

      <div ref={messagesContainerRef} className="rockship-messages-container">

        {/* Typing indicator moved to the bottom */}

        {messages.length === 0 && !isLoading ? (
          <div className="rockship-welcome-message">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <p className="text-base">{config.welcomeMessage || "Chào mừng bạn đến với Rockship Support!"}</p>
            <p className="text-sm mt-2 opacity-75">Hãy gửi tin nhắn để bắt đầu trò chuyện</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} theme={config.theme} />
            ))}
          </>
        )}
        {isLoading && (
          <div className="rockship-loading">
            <span>{messages.length === 0 ? "Đang tải tin nhắn" : "Đang trả lời"}</span>
            <div className="rockship-loading-dots">
              <span className="rockship-loading-dot"></span>
              <span className="rockship-loading-dot"></span>
              <span className="rockship-loading-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={config.theme} />
    </div>
  )
}
