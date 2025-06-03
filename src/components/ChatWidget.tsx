import React, { useState, useEffect, useRef, useCallback } from "react"
import { ChatbotConfig, Message, Conversation } from "../types"
import { ChatbotAPI } from "../api"
import { ChatHeader } from "./ChatHeader"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import ReactMarkdown from "react-markdown"
import { getTranslations, Language } from "../translations"

interface ChatWidgetProps {
  config: ChatbotConfig
  isOpen: boolean
  isMinimized: boolean
  onClose: () => void
  onMinimize: () => void
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ config, isOpen, isMinimized, onClose, onMinimize }) => {
  // Get translations based on language setting
  const language = config.language || 'en';
  const translations = getTranslations(language as Language);
  // State for chat
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversationAlias, setConversationAlias] = useState<string>("")
  const [initialized, setInitialized] = useState(false)

  // Chat history state
  const [showHistory, setShowHistory] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const chatWidgetRef = useRef<HTMLDivElement>(null)

  // Check if apiToken is available in config
  const apiToken = config.apiToken || ""
  const api = useRef(new ChatbotAPI(apiToken, config.apiBaseUrl))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Load latest conversation and messages
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true)

      // First, get the latest conversation
      const convResponse = await api.current.listConversations(config.platformUserId)

      if (convResponse.data.conversation && convResponse.data.conversation.length > 0) {
        // Get the most recent conversation
        const latestConversation = convResponse.data.conversation[0]
        setConversationId(latestConversation.id)
        setConversationAlias(latestConversation.conversation_alias)

        // Then load messages for this conversation
        await loadMessages(latestConversation.id)
      } else {
        // No conversations yet
        setMessages([])
        setConversationId(null)
        setConversationAlias("")
      }
    } catch (error) {
      console.error("Error loading initial data:", error)
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }, [config.platformUserId])

  // Load messages for a specific conversation
  const loadMessages = useCallback(
    async (convId: string, page: number = 1) => {
      try {
        setIsLoading(true)
        const response = await api.current.getMessages(config.platformUserId, convId, page)

        if (response.data.message && response.data.message.length > 0) {
          // Reverse messages to show oldest first if it's the first page
          const sortedMessages =
            page === 1 ? [...response.data.message].reverse() : [...messages, ...response.data.message.reverse()]

          setMessages(sortedMessages)
          setConversationId(response.data.conversation_id)

          // Update pagination info
          setCurrentPage(page)
          setTotalPages(Math.ceil(response.paging.total / response.paging.limit))
        } else if (page === 1) {
          // Only clear messages if it's the first page
          setMessages([])
        }
      } catch (error) {
        console.error("Error loading messages:", error)
        if (page === 1) {
          setMessages([])
        }
      } finally {
        setIsLoading(false)
      }
    },
    [config.platformUserId, messages]
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
      // Use conversation_alias if available
      const response = await api.current.sendMessage(message, config.userName, config.platformUserId, conversationAlias)

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: response.data.conversation_id,
        content: response.data.ai_reply,
        type: "assistant",
        token_usage: response.data.token_usage,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Update conversation information from response
      setConversationId(response.data.conversation_id)
      setConversationAlias(response.data.conversation_alias)
    } catch (error) {
      console.error("Error sending message:", error)
      // Remove user message on error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearConversation = useCallback(async () => {
    if (isClearing || !conversationId) return

    setIsClearing(true)

    try {
      // Delete the current conversation
      await api.current.clearConversation(conversationId)

      // Reset state
      setMessages([])
      setConversationId(null)
      setConversationAlias("")
    } catch (error) {
      console.error("Error clearing conversation:", error)
    } finally {
      setIsClearing(false)
    }
  }, [conversationId, isClearing])

  // Initialize data when opening chat
  useEffect(() => {
    if (isOpen && !initialized) {
      loadInitialData()
      setInitialized(true)
    }
  }, [isOpen, initialized, loadInitialData])

  // Add initial welcome message when there are no messages
  useEffect(() => {
    if (isOpen && initialized && messages.length === 0 && !isLoading && !conversationId) {
      const welcomeMessage: Message = {
        id: "welcome-" + Date.now().toString(),
        conversation_id: "",
        content: config.welcomeMessage || translations.defaultGreeting,
        type: "assistant",
        token_usage: 0,
        created_at: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, initialized, messages.length, isLoading, conversationId, config.welcomeMessage])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  // Handle scroll to load more messages
  const handleMessagesScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.currentTarget

      // If scrolled to top and there are more pages, load previous messages
      if (scrollTop === 0 && currentPage < totalPages && !isLoading) {
        loadMessages(conversationId as string, currentPage + 1)
      }
    },
    [conversationId, currentPage, totalPages, isLoading, loadMessages]
  )

  // Select a conversation from history
  const selectConversation = useCallback(
    async (id: string, alias: string) => {
      setConversationId(id)
      setConversationAlias(alias)
      setMessages([])
      setShowHistory(false) // Hide dropdown after selection
      setIsLoading(true) // Show loading indicator

      try {
        const response = await api.current.getMessages(config.platformUserId, id)
        setMessages(response.data.message || []) // API returns message array not messages
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setIsLoading(false) // Hide loading indicator
      }
    },
    [config.platformUserId]
  )

  // Start a new conversation
  const startNewConversation = useCallback(() => {
    setConversationId(null)
    setConversationAlias("") // Empty conversation_alias for new conversation
    setMessages([])
    setShowHistory(false) // Hide history dropdown

    // Add welcome message with original styling
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      conversation_id: "",
      content: config.welcomeMessage || translations.defaultGreeting,
      type: "assistant",
      token_usage: 0,
      created_at: new Date().toISOString(),
    }

    setMessages([welcomeMessage])
  }, [config.welcomeMessage])

  // Load conversation list
  const loadConversations = useCallback(async () => {
    if (!config.platformUserId) return

    setLoadingHistory(true)
    try {
      const response = await api.current.listConversations(config.platformUserId)
      if (response.data && response.data.conversation) {
        setConversations(response.data.conversation)
      } else {
        setConversations([])
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
      setConversations([])
    } finally {
      setLoadingHistory(false)
    }
  }, [config.platformUserId])

  // Load conversations when showing history panel
  useEffect(() => {
    if (showHistory) {
      loadConversations()
    }
  }, [showHistory, loadConversations])

  // Toggle fullscreen function
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  // Position classes based on config
  const position = config.position || "bottom-right"
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  if (!isOpen) return null

  // Don't display chat content when minimized
  if (isMinimized) return null

  return (
    <div
      ref={chatWidgetRef}
      className={`rockship-chatbox ${isOpen ? "open" : ""} fixed ${positionClasses[position]}`}
      style={{
        backgroundColor: config.theme?.backgroundColor || "#ffffff",
        width: isFullscreen ? config.fullscreenConfig?.width || "90vw" : "400px",
        height: isFullscreen ? config.fullscreenConfig?.height || "90vh" : "600px",
        position: "fixed",
        zIndex: 1000,
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      }}
    >
      <ChatHeader
        userName={config.userName}
        onClose={onClose}
        onClear={handleClearConversation}
        isClearing={isClearing}
        theme={config.theme}
        supportAgentName={config.supportAgentName}
        headerLogo={config.headerLogo}
        onShowHistory={() => setShowHistory(!showHistory)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        language={language as Language}
      />

      {/* Chat History Dropdown */}
      {showHistory && (
        <div className="mt-[72px] mx-4 bg-white z-20 flex flex-col rounded-lg shadow-lg overflow-hidden border w-full">
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-medium">{translations.conversationHistory}</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              title={translations.minimize}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          <div className="max-h-60 overflow-auto p-3">
            {loadingHistory ? (
              <div className="flex justify-center items-center h-20">
                <div className="loader"></div>
              </div>
            ) : conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv.id, conv.conversation_alias)}
                    className={`p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      conv.id === conversationId ? "border-blue-500 bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium truncate">
                      {conv.title || conv.last_message || translations.backToChat}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {new Date(conv.updated_at).toLocaleDateString()} {new Date(conv.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">{translations.noConversations}</p>
            )}
          </div>

          <div className="p-3 border-t">
            <button
              onClick={startNewConversation}
              className="w-full py-2 text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              style={{ backgroundColor: config.theme?.primaryColor || "#007bff" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              {translations.backToChat}
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-20"
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        style={{ height: "calc(100% - 60px)" }}
      >
        {isLoading && messages.length === 0 && (
          <div className="rockship-loading-messages">
            <div className="rockship-loading-spinner">
              <div
                className="animate-spin h-8 w-8 border-3 border-t-transparent rounded-full"
                style={{
                  borderColor: `${config.theme?.primaryColor || "#007bff"} transparent transparent transparent`,
                }}
              ></div>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "assistant" ? "justify-start" : "justify-end"}`}>
            <div
              style={{
                backgroundColor: message.type === "assistant" ? "#F8F9FA" : config.theme?.primaryColor || "#007bff",
                color: message.type === "assistant" ? "#212529" : "#FFFFFF",
                padding: "12px 16px",
                borderRadius: message.type === "assistant" ? "12px 12px 12px 0" : "12px 12px 0 12px",
                maxWidth: "80%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
              className="markdown-content"
            >
              {message.type === "assistant" ? (
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator when loading */}
        {isLoading && messages.length > 0 && (
          <div className="rockship-loading rockship-typing">
            <span>...</span>
            <div className="rockship-loading-dots">
              <span className="rockship-loading-dot"></span>
              <span className="rockship-loading-dot"></span>
              <span className="rockship-loading-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={config.theme} language={language as Language} />
    </div>
  )
}
