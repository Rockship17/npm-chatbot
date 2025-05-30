import React, { useState, useEffect, useRef, useCallback } from "react"
import { ChatbotConfig, Message } from "../types"
import { ChatbotAPI } from "../api"
import { ChatHeader } from "./ChatHeader"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"

// Fix links to open in new tabs
const externalLinkHandler = () => {
  // Add target="_blank" and rel="noopener noreferrer" to all links in the chatbox
  setTimeout(() => {
    const chatboxLinks = document.querySelectorAll('.rockship-chatbox a');
    chatboxLinks.forEach(link => {
      const anchor = link as HTMLAnchorElement;
      if (!anchor.getAttribute('target')) {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, 100);
};

interface ChatWidgetProps {
  config: ChatbotConfig
  isOpen: boolean
  isMinimized: boolean
  onClose: () => void
  onMinimize: () => void
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ config, isOpen, isMinimized, onClose, onMinimize }) => {
  // State cho chat
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  
  // State cho resizable chat widget - di chuyển lên đầu component
  const [chatSize, setChatSize] = useState({ width: 400, height: 600 });

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatWidgetRef = useRef<HTMLDivElement>(null);
  
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
    setIsClearing(true)
    
    try {
      // Nếu đã có ID cuộc hội thoại, gọi API delete
      if (conversationId) {
        await api.current.clearConversation(conversationId)
      } else {
        // Nếu chưa có ID cuộc hội thoại nhưng đã có tin nhắn, 
        // thử gọi API để lấy ID rồi xóa
        if (messages.length > 0 && config.platformUserId) {
          try {
            const convResponse = await api.current.getConversation(config.platformUserId)
            if (convResponse?.data?.id) {
              await api.current.clearConversation(convResponse.data.id)
            }
          } catch (convError) {
            console.log("Không có cuộc hội thoại trước đó để xóa")
          }
        }
      }
      
      // Lúc nào cũng xóa tin nhắn và reset ID cuộc hội thoại ở client
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
      // Fix external links after messages are rendered
      externalLinkHandler();
    }
  }, [messages]);

  // State cho resize handling
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartPos = useRef({ x: 0, y: 0 });
  
  // Bắt đầu resize
  const handleResizeStart = (e: React.MouseEvent) => {
    if (!config.isResizable) return;
    
    setIsResizing(true);
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };
  
  // Thực hiện resize
  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    // Tính toán delta - khoảng thay đổi của con trỏ chuột
    const deltaX = e.clientX - resizeStartPos.current.x;
    const deltaY = e.clientY - resizeStartPos.current.y;
    
    // Tính toán giá trị tối đa theo kích thước màn hình
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    
    setChatSize(prev => ({
      // Nút resize ở góc trái trên, nên:
      // - Khi kéo sang trái (deltaX âm), width tăng
      // - Khi kéo lên trên (deltaY âm), height tăng
      // Cho phép kích thước tối đa là 100% màn hình
      width: Math.min(maxWidth, Math.max(300, prev.width + (deltaX * -1))), 
      height: Math.min(maxHeight, Math.max(400, prev.height + (deltaY * -1)))
    }));
    
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
  }, [isResizing]);
  
  // Kết thúc resize
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);
  
  // Các biến không phải hooks có thể giữ nguyên vị trí
  const position = config.position || "bottom-right"
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }
  
  // Thêm event listeners cho resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, handleResize, handleResizeEnd]);

  if (!isOpen) return null;

  // Không hiển thị nội dung chat khi ở chế độ thu nhỏ
  if (isMinimized) return null;
  
  return (
    <div
      ref={chatWidgetRef}
      className={`rockship-chatbox ${isOpen ? "open" : ""} fixed ${positionClasses[position]}`}
      style={{
        backgroundColor: config.theme?.backgroundColor || "#ffffff",
        width: config.isResizable ? `${chatSize.width}px` : '400px',
        height: config.isResizable ? `${chatSize.height}px` : '600px',
        position: 'fixed',
        zIndex: 1000,
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
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
      />
      
      {/* Nút resize tự triển khai */}
      {config.isResizable && (
        <div 
          className="rockship-resize-handle" 
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            left: '2px',
            top: '2px',
            width: '20px',
            height: '20px',
            cursor: 'nw-resize',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(2px)',
            transition: isResizing ? 'none' : 'all 0.2s ease'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" style={{ transform: 'rotate(-45deg)' }}>
            <path fill={config.theme?.primaryColor === '#007bff' ? '#ffffff' : config.theme?.primaryColor} 
                  d="M12 2V8H10V4H6V2H12ZM4 12H2V6H4V10H8V12H4Z" />
          </svg>
        </div>
      )}

      <div ref={messagesContainerRef} className="rockship-messages-container">
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
          messages.length === 0 ? (
            <div className="rockship-loading-messages">
              <div className="rockship-loading-spinner">
                <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="rockship-loading rockship-typing">
              <span>Đang trả lời</span>
              <div className="rockship-loading-dots">
                <span className="rockship-loading-dot"></span>
                <span className="rockship-loading-dot"></span>
                <span className="rockship-loading-dot"></span>
              </div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={config.theme} />
    </div>
  )
}
