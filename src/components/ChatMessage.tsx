import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
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
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="text-sm leading-relaxed markdown-content">
              {/* Use useMemo to prevent unnecessary re-renders during streaming */}
              {useMemo(() => {
                // Convert message content to a clean string
                // This helps ensure all Vietnamese diacritical marks are preserved
                let contentToRender = message.content;
                
                // We're now handling URL fixing with custom renderers
                // No pre-processing needed
                
                // Log the exact content being rendered for debugging
                if (contentToRender && contentToRender.includes('ạ') || contentToRender.includes('ắ') || contentToRender.includes('ế')) {
                  console.log('Rendering Vietnamese text, length:', contentToRender.length);
                }
                
                return (
                  <ReactMarkdown
                    components={{
                      // Customize link rendering to open in new tab
                      a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                      // Handle code blocks properly
                      code: ({node, ...props}) => <code className="bg-gray-100 p-1 rounded" {...props} />,
                      // Ensure paragraphs preserve whitespace better
                      p: ({node, ...props}) => <p style={{whiteSpace: 'pre-wrap'}} {...props} />,
                      // Custom image renderer that preserves URL signatures
                      img: ({node, ...props}) => {
                        // Use the src directly without any modification to preserve signatures
                        return <img {...props} alt={props.alt || ""} />
                      }
                    }}
                  >
                    {contentToRender}
                  </ReactMarkdown>
                );
              }, [message.content])}
            </div>
          )}
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {formatTime(message.created_at)}
        </div>
      </div>
    </div>
  )
}
