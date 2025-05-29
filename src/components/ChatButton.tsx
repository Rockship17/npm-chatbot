import React from "react"
import { ChatbotConfig } from "../types"

interface ChatButtonProps {
  onClick: () => void
  isOpen: boolean
  config: ChatbotConfig
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen, config }) => {
  const position = config.position || "bottom-right"
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  return (
    <button
      onClick={onClick}
      className={`fixed ${
        positionClasses[position]
      } w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 ${
        isOpen ? "rotate-45" : "hover:scale-110"
      }`}
      style={{
        backgroundColor: config.theme?.primaryColor || "#007bff",
        transform: isOpen ? "rotate(45deg)" : "none",
      }}
      title="Chat với chúng tôi"
    >
      {isOpen ? (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      )}
    </button>
  )
}
