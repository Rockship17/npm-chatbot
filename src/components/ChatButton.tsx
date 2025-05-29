import React, { useState, useRef, useEffect } from "react"
import { ChatbotConfig } from "../types"

interface ChatButtonProps {
  onClick: () => void
  isOpen: boolean
  isMinimized: boolean
  onMinimize: () => void
  config: ChatbotConfig
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen, isMinimized, onMinimize, config }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [buttonTop, setButtonTop] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const configPosition = config.position || "bottom-right";
  
  // Khởi tạo vị trí ban đầu dựa trên config
  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const initialTop = configPosition.includes('top') 
        ? 16 // top-left or top-right
        : window.innerHeight - rect.height - 16; // bottom-left or bottom-right
      
      setButtonTop(initialTop);
    }
  }, [configPosition]);

  // Xử lý sự kiện chuột/chạm cho tính năng kéo thả
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return; // Không cho phép kéo khi chat đang mở
    
    setIsDragging(true);
    setInitialPos({ 
      x: e.clientX, 
      y: e.clientY 
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && buttonTop !== null) {
      const deltaY = e.clientY - initialPos.y;
      const newTop = Math.max(16, Math.min(window.innerHeight - 80, buttonTop + deltaY));
      setButtonTop(newTop);
      setPosition({ ...position, y: deltaY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Cập nhật vị trí ban đầu sau khi kéo
      if (buttonTop !== null) {
        setInitialPos({ ...initialPos, y: buttonTop });
      }
    }
  };

  // Đăng ký/hủy đăng ký sự kiện
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, initialPos, buttonTop]);

  return (
    <div className="fixed z-40" style={{ right: configPosition.includes('right') ? '16px' : 'auto', left: configPosition.includes('left') ? '16px' : 'auto', top: buttonTop ?? 'auto' }}>
      {isOpen && !isMinimized && (
        <button 
          onClick={onMinimize}
          className="absolute -top-10 right-0 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-md hover:bg-white transition-all duration-200"
          title="Thu nhỏ"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        className={`cyhome-floating-button ${
          isMinimized ? 'minimized' : isOpen ? '' : 'hoverable'
        } ${isDragging ? 'dragging' : ''} ${
          isOpen && !isMinimized ? 'rotate-45' : ''
        } ${isMinimized && isOpen ? 'expanding' : ''}`}
        style={{
          backgroundColor: config.theme?.primaryColor || "#007bff",
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
    </div>
  )
}
