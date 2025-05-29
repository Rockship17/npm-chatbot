import React from "react"
import { Message } from "../types"

interface ChatMessageProps {
  message: Message
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, theme }) => {
  const isUser = message.type === "user"
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`px-4 py-2 rounded-lg break-words ${
            isUser ? "rounded-br-none text-white" : "rounded-bl-none border"
          }`}
          style={{
            backgroundColor: isUser ? theme?.primaryColor || "#007bff" : theme?.backgroundColor || "#f8f9fa",
            color: isUser ? "white" : theme?.textColor || "#333",
            borderColor: !isUser ? "#e9ecef" : "transparent",
          }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {formatTime(message.created_at)}
        </div>
      </div>
    </div>
  )
}
