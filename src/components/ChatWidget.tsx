import React, { useState, useEffect, useCallback, useRef } from "react"
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
  const language = config.language || "en"
  const translations = getTranslations(language as Language)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversationAliasId, setConversationAliasId] = useState<string>("")
  const [initialized, setInitialized] = useState(false)

  const [showHistory, setShowHistory] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [isFullscreen, setIsFullscreen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const chatWidgetRef = useRef<HTMLDivElement>(null)
  const previousScrollHeight = useRef<number>(0)

  const apiToken = config.apiToken || ""
  const api = useRef(new ChatbotAPI(apiToken, config.apiBaseUrl))

  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      console.error("Error scrolling to bottom:", error)
    }
  }

  const loadMessages = useCallback(
    async (convId: string, page: number = 1) => {
      try {
        if (page > 1 && messagesContainerRef.current) {
          previousScrollHeight.current = messagesContainerRef.current.scrollHeight
        }

        if (page === 1) {
          setIsLoading(true)
        } else {
          setIsLoadingMore(true)
        }

        const response = await api.current.getMessages(config.platformUserId, convId, page)

        if (response.data.message && response.data.message.length > 0) {
          const sortedMessages = [...response.data.message].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )

          if (page === 1) {
            setMessages(sortedMessages)
          } else {
            setMessages((prevMessages) => {
              const allMessages = [...sortedMessages, ...prevMessages]
              const uniqueMessages = allMessages.filter(
                (message, index, self) => index === self.findIndex((m) => m.id === message.id)
              )
              return uniqueMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            })
          }

          setConversationId(response.data.conversation_id)
          setCurrentPage(page)
          setTotalPages(Math.ceil(response.paging.total / response.paging.limit))
        } else if (page === 1) {
          setMessages([])
        }
      } catch (error) {
        console.error("Error loading messages:", error)
        if (page === 1) {
          setMessages([])
        }
      } finally {
        if (page === 1) {
          setIsLoading(false)
        } else {
          setIsLoadingMore(false)
        }
      }
    },
    [config.platformUserId]
  )

  const loadInitialData = useCallback(async () => {
    if (!config.platformUserId) return

    setIsLoading(true)
    try {
      console.log("Loading conversations for user:", config.platformUserId)
      const conversationsResponse = await api.current.listConversations(config.platformUserId, 1)

      if (conversationsResponse?.data?.conversation && conversationsResponse.data.conversation.length > 0) {
        const latestConversation = conversationsResponse.data.conversation[0]
        console.log("Latest conversation found:", latestConversation)

        setConversationId(latestConversation.id)
        setConversationAliasId(latestConversation.conversation_alias_id || "")

        console.log(`Loading messages for conversation ID: ${latestConversation.id}`)
        const messagesResponse = await api.current.getMessages(config.platformUserId, latestConversation.id, 1)

        if (messagesResponse?.data?.message && messagesResponse.data.message.length > 0) {
          const sortedMessages = [...messagesResponse.data.message].reverse()
          console.log(`Loaded ${sortedMessages.length} messages`)
          setMessages(sortedMessages)
          if (messagesResponse.paging) {
            setCurrentPage(messagesResponse.paging.page || 1)
            setTotalPages(Math.ceil((messagesResponse.paging.total || 0) / 10))
          }
        } else {
          console.log("No messages found in conversation, using welcome message")
          setMessages([
            {
              id: "welcome-" + Date.now().toString(),
              conversation_id: latestConversation.id,
              content: config.welcomeMessage || translations.defaultGreeting,
              type: "assistant",
              token_usage: 0,
              created_at: new Date().toISOString(),
            },
          ])
        }
      } else {
        console.log("No conversations found, will create new conversation on first message")
        setConversationId("")
        setConversationAliasId("")
        setMessages([
          {
            id: "welcome-" + Date.now().toString(),
            conversation_id: "",
            content: config.welcomeMessage || translations.defaultGreeting,
            type: "assistant",
            token_usage: 0,
            created_at: new Date().toISOString(),
          },
        ])
      }
    } catch (error) {
      console.error("Error loading initial data:", error)
      setConversationId("")
      setConversationAliasId("")
      setMessages([
        {
          id: "welcome-" + Date.now().toString(),
          conversation_id: "",
          content: config.welcomeMessage || translations.defaultGreeting,
          type: "assistant",
          token_usage: 0,
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [config.platformUserId, config.welcomeMessage, translations.defaultGreeting])

  const selectConversation = useCallback(
    async (id: string, alias: string) => {
      setConversationId(id)
      setConversationAliasId(alias)
      setMessages([])
      setShowHistory(false)
      setCurrentPage(1)
      setTotalPages(1)

      try {
        await loadMessages(id, 1)
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    },
    [loadMessages]
  )

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    setIsLoading(true)

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: message,
      type: "user",
      conversation_id: conversationId || "",
      token_usage: 0,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newUserMessage])

    const responseId = (Date.now() + 1).toString()
    setStreamingMessageId(responseId)

    const aiMessage: Message = {
      id: responseId,
      content: "",
      type: "assistant",
      conversation_id: conversationId || "",
      token_usage: 0,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, aiMessage])

    try {
      console.log(
        `Sending message with conversation_alias_id: "${conversationAliasId || ""}" and conversation_id: "${
          conversationId || ""
        }"`
      )

      const response = await api.current.sendMessage(
        message,
        config.userName,
        config.platformUserId,
        conversationAliasId || "",
        conversationId || "",
        {
          onComplete: (response) => {
            console.log("Response received:", response)
          },
          onError: (err) => {
            console.error("API error:", err)
          },
        }
      )

      if (response.data?.conversation_alias_id) {
        console.log("Setting conversation_alias_id:", response.data.conversation_alias_id)
        setConversationAliasId(response.data.conversation_alias_id)
      }

      if (response.data?.conversation_id) {
        console.log("Setting conversation_id:", response.data.conversation_id)
        setConversationId(response.data.conversation_id)
      }

      if (response.data?.ai_reply) {
        console.log(`Setting message from response: ${response.data.ai_reply.length} chars`)

        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.id === responseId) {
              return {
                ...msg,
                content: response.data.ai_reply,
                conversation_id: response.data.conversation_id || msg.conversation_id,
                token_usage: response.data.token_usage || 0,
              }
            }
            return msg
          })
        )
      }

      setIsLoading(false)
      setStreamingMessageId(null)
      scrollToBottom()
    } catch (err) {
      console.error("Error sending message:", err)

      const errorMsg = translations?.errorMessage || "Sorry, there was an error processing your request."

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === responseId) {
            return {
              ...msg,
              content: errorMsg,
            }
          }
          return msg
        })
      )
      setStreamingMessageId(null)
      setIsLoading(false)
    }
  }

  const handleClearConversation = useCallback(async () => {
    if (isClearing || !conversationId) return

    setIsClearing(true)

    try {
      await api.current.clearConversation(conversationId)

      setMessages([])
      setConversationId(null)
      setConversationAliasId("")
      setCurrentPage(1)
      setTotalPages(1)
    } catch (error) {
      console.error("Error clearing conversation:", error)
    } finally {
      setIsClearing(false)
    }
  }, [conversationId, isClearing])

  const handleMessagesScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.currentTarget

      if (scrollTop === 0 && currentPage < totalPages && !isLoadingMore && conversationId) {
        const nextPage = currentPage + 1
        console.log(`Loading page ${nextPage} of ${totalPages}`)
        loadMessages(conversationId, nextPage)
      }
    },
    [conversationId, currentPage, totalPages, isLoadingMore, loadMessages]
  )

  const startNewConversation = useCallback(() => {
    setConversationId("")
    setConversationAliasId("")
    setMessages([])
    setShowHistory(false)
    setCurrentPage(1)
    setTotalPages(1)

    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      conversation_id: "",
      content: config.welcomeMessage || translations.defaultGreeting,
      type: "assistant",
      token_usage: 0,
      created_at: new Date().toISOString(),
    }

    setMessages([welcomeMessage])
  }, [config.welcomeMessage, translations.defaultGreeting])

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

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isOpen && !initialized) {
      setInitialized(true)
      loadInitialData()
    }
  }, [isOpen, initialized])

  useEffect(() => {
    if (isOpen && initialized && messages.length === 0 && !isLoading && !conversationId) {
      // If we have no messages and no conversation id, set a welcome message
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
  }, [
    isOpen,
    initialized,
    messages.length,
    isLoading,
    conversationId,
    config.welcomeMessage,
    translations.defaultGreeting,
  ])

  useEffect(() => {
    if (messages.length > 0 && !isLoadingMore) {
      scrollToBottom()
    }
  }, [messages, isLoadingMore])

  useEffect(() => {
    if (!isLoadingMore && previousScrollHeight.current > 0 && messagesContainerRef.current) {
      const newScrollHeight = messagesContainerRef.current.scrollHeight
      const heightDifference = newScrollHeight - previousScrollHeight.current

      messagesContainerRef.current.scrollTop = heightDifference
      previousScrollHeight.current = 0
    }
  }, [isLoadingMore])

  useEffect(() => {
    if (showHistory) {
      loadConversations()
    }
  }, [showHistory, loadConversations])

  const position = config.position || "bottom-right"
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  if (!isOpen) return null
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
                    onClick={() => selectConversation(conv.id, conv.conversation_alias_id)}
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

      <div
        className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4 pb-20"
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        style={{ height: "calc(100% - 60px)" }}
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <div
              className="animate-spin h-6 w-6 border-2 border-t-transparent rounded-full"
              style={{
                borderColor: `${config.theme?.primaryColor || "#007bff"} transparent transparent transparent`,
              }}
            ></div>
          </div>
        )}
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
                message.id === streamingMessageId && !message.content ? (
                  <div className="rockship-loading rockship-typing">
                    <span>{translations.typingLabel}</span>
                    <div className="rockship-loading-dots">
                      <span className="rockship-loading-dot"></span>
                      <span className="rockship-loading-dot"></span>
                      <span className="rockship-loading-dot"></span>
                    </div>
                  </div>
                ) : (
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                      img: ({ node, ...props }) => {
                        return <img {...props} alt={props.alt || ""} />
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && !isLoadingMore && !streamingMessageId && (
          <div className="rockship-loading rockship-typing">
            <span>{translations.typingLabel}</span>
            <div className="rockship-loading-dots">
              <span className="rockship-loading-dot"></span>
              <span className="rockship-loading-dot"></span>
              <span className="rockship-loading-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        theme={config.theme}
        language={language as Language}
      />
    </div>
  )
}
