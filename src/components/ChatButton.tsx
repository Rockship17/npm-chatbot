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
      const deltaX = e.clientX - initialPos.x;
      const newTop = Math.max(16, Math.min(window.innerHeight - 80, buttonTop + deltaY));
      setButtonTop(newTop);
      // Update both X and Y positions for more natural drag movement
      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY
      });
      // Update initial position for next movement calculation
      setInitialPos({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      // Cập nhật vị trí ban đầu sau khi kéo
      if (buttonTop !== null) {
        setInitialPos({ ...initialPos, y: buttonTop });
      }
      
      // Prevent the click event from firing after drag ends
      e.stopPropagation();
      e.preventDefault();
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
    <div className="fixed z-40" style={{ 
      right: isMinimized ? '0' : configPosition.includes('right') ? '16px' : 'auto', 
      left: configPosition.includes('left') ? '16px' : 'auto', 
      top: buttonTop ?? 'auto',
      transition: 'right 0.3s ease'
    }}>
      {/* Minimize button always shown when the main button is visible */}
      {!isOpen && (
        <button 
          onClick={onMinimize}
          className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:bg-white transition-all duration-200 w-5 h-5 flex items-center justify-center z-50"
          title="Thu nhỏ về góc phải"
        >
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      {/* Button for minimized state */}
      {isMinimized && isOpen && (
        <button 
          onClick={() => onMinimize()}
          className="absolute -top-10 right-0 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-md hover:bg-white transition-all duration-200"
          title="Mở rộng"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
      {/* Main button - only shown when chat is not open or is minimized */}
      {(!isOpen || isMinimized) && (
        <button
          ref={buttonRef}
          onClick={(e) => {
            // Only trigger onClick if not dragging
            if (!isDragging) {
              onClick();
            }
          }}
          onMouseDown={handleMouseDown}
          className={`rockship-floating-button ${
            isMinimized ? 'minimized' : 'hoverable'
          } ${isDragging ? 'dragging' : ''} ${
            isMinimized && isOpen ? 'expanding' : ''
          }`}
          style={{
            backgroundColor: config.theme?.primaryColor || "#007bff",
          }}
          title="Chat với chúng tôi"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        </button>
      )}
    </div>
  )
}
