import React, { useState, useRef, useEffect, KeyboardEvent } from "react"
import { getTranslations, Language } from "../translations"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  language?: Language // Language setting
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, theme, language = 'en' }) => {
  // Get translations based on language
  const translations = getTranslations(language)
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to get the correct scrollHeight
      textarea.style.height = 'auto'
      // Set the height to the scrollHeight
      const newHeight = Math.min(textarea.scrollHeight, 120) // Max height of 120px
      textarea.style.height = `${newHeight}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={translations.enterMessage}
          style={{
            borderColor: "#e9ecef",
            minHeight: "40px",
            maxHeight: "120px",
            overflowY: "auto"
          }}
          // Custom className with focus ring color based on theme
          className={`flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-${
            theme?.primaryColor?.replace("#", "") || "007bff"
          }`}
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: theme?.primaryColor || "#007bff",
          }}
        >
          {isLoading ? (
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
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
