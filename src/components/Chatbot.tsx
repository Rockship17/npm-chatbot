import React, { useState, useEffect } from "react"
import { ChatbotConfig } from "../types"
import { ChatButton } from "./ChatButton"
import { ChatWidget } from "./ChatWidget"

interface ChatbotProps {
  config: ChatbotConfig
}

export const Chatbot: React.FC<ChatbotProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Inject styles when component mounts
  useEffect(() => {
    const styleId = "cyhome-chatbot-styles"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .transition-colors {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .duration-300 {
          transition-duration: 300ms;
        }
        .hover\\:scale-110:hover {
          transform: scale(1.1);
        }
        .hover\\:shadow-xl:hover {
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        }
        .focus\\:outline-none:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
        .focus\\:ring-2:focus {
          box-shadow: 0 0 0 2px var(--ring-color, rgb(59 130 246 / 0.5));
        }
        .focus\\:ring-opacity-50:focus {
          --ring-opacity: 0.5;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const toggleChat = () => {
    if (isMinimized) {
      // Nếu đang ở trạng thái thu nhỏ, click vào button sẽ mở rộng lại
      setIsMinimized(false)
    } else {
      // Nếu không ở trạng thái thu nhỏ, sẽ toggle mở/đóng chat
      setIsOpen(!isOpen)
    }
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }
  
  const minimizeChat = () => {
    setIsMinimized(true)
  }

  return (
    <div className={`cyhome-chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      <ChatButton 
        onClick={toggleChat} 
        isOpen={isOpen} 
        isMinimized={isMinimized}
        onMinimize={minimizeChat}
        config={config} 
      />
      <ChatWidget 
        config={config} 
        isOpen={isOpen} 
        isMinimized={isMinimized}
        onClose={closeChat} 
        onMinimize={minimizeChat}
      />
    </div>
  )
}
