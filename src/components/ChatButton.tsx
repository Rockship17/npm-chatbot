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
  // Không sử dụng isMinimized và onMinimize nữa, nhưng vẫn giữ trong props để tránh breaking changes
  const [isDragging, setIsDragging] = useState(false)
  const [justDragged, setJustDragged] = useState(false) // Thêm biến để theo dõi button vừa được kéo thả
  const [position, setPosition] = useState(() => {
    // Initialize position from config if provided, otherwise default values
    return {
      x: config.buttonConfig?.position?.x || 0,
      y: config.buttonConfig?.position?.y || 0,
    }
  })
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dragStartTime = useRef<number>(0) // Thêm ref để theo dõi thời điểm bắt đầu kéo
  const dragTimer = useRef<number | null>(null)
  const mouseDownRef = useRef(false)
  const configPosition = config.position || "bottom-right"

  // Handle initial positioning and update when config changes
  useEffect(() => {
    if (buttonRef.current) {
      // Apply custom position from config if available
      if (config.buttonConfig?.position?.x !== undefined && config.buttonConfig?.position?.y !== undefined) {
        setPosition({
          x: config.buttonConfig.position.x,
          y: config.buttonConfig.position.y,
        })
      } else {
        // Default positioning based on configPosition if no custom position is set
        const rect = buttonRef.current.getBoundingClientRect()
        let posX = 0
        let posY = 0

        if (configPosition.includes("right")) {
          posX = window.innerWidth - rect.width - 16
        } else if (configPosition.includes("left")) {
          posX = 16
        }

        if (configPosition.includes("top")) {
          posY = 16
        } else if (configPosition.includes("bottom")) {
          posY = window.innerHeight - rect.height - 16
        }

        setPosition({ x: posX, y: posY })
      }
    }
  }, [configPosition, config.buttonConfig?.position])

  // Handle dragging start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return // Don't allow dragging when chat is open

    mouseDownRef.current = true
    setInitialPos({
      x: e.clientX,
      y: e.clientY,
    })

    // Start a timer: after 200ms, set dragging
    dragTimer.current = window.setTimeout(() => {
      if (mouseDownRef.current) {
        setIsDragging(true)
        dragStartTime.current = Date.now()
      }
    }, 200)

    // Prevent default to avoid text selection during drag
    e.preventDefault()
  }

  // On mouse up on the button (not document)
  const handleButtonMouseUp = (e: React.MouseEvent) => {
    if (dragTimer.current !== null) { clearTimeout(dragTimer.current); dragTimer.current = null; }

    // If not dragging, treat as click
    if (!isDragging && !justDragged) {
      onClick()
    }
    mouseDownRef.current = false
  }

  // On mouse leave (cancel drag intent)
  const handleButtonMouseLeave = () => {
    if (dragTimer.current !== null) { clearTimeout(dragTimer.current); dragTimer.current = null; }
    mouseDownRef.current = false
  }

  // Handle dragging movement - now supports both X and Y directions
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - initialPos.x
      const deltaY = e.clientY - initialPos.y

      // Calculate new position with boundaries
      const newX = Math.max(
        0,
        Math.min(window.innerWidth - (buttonRef.current?.offsetWidth || 60), position.x + deltaX)
      )
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - (buttonRef.current?.offsetHeight || 60), position.y + deltaY)
      )

      // Update position
      setPosition({ x: newX, y: newY })

      // Update initial position for next movement calculation
      setInitialPos({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  // Handle dragging end
  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      setIsDragging(false)

      const dragDuration = Date.now() - dragStartTime.current

      // Chỉ ngăn chặn sự kiện click khi kéo trong khoảng thời gian ngắn (100ms)
      // Đây là trường hợp người dùng có ý định click chứ không phải kéo
      if (dragDuration < 100) {
        e.stopPropagation()
        e.preventDefault()
        return
      }

      // Đánh dấu rằng button vừa được kéo thả
      setJustDragged(true)

      // Reset trạng thái justDragged sau 500ms để cho phép click lại
      setTimeout(() => {
        setJustDragged(false)
      }, 500)

      // Không tự động mở box chat sau khi kéo thả nữa
      // Người dùng sẽ cần click vào button để mở box chat
    }
  }

  // Register/unregister event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, initialPos, position])

  // Calculate button size with default fallback
  const buttonSize = config.buttonConfig?.size || 60

  // Define custom button shadow or use enhanced default shadow
  const buttonShadow = config.buttonConfig?.shadow || "0 8px 25px rgba(102, 126, 234, 0.6)"
  return (
    <div
      className="fixed z-40"
      style={{
        left: position.x + "px",
        top: position.y + "px",
        transition: isDragging ? "none" : "all 0.3s ease",
      }}
    >
      {/* Nút thu nhỏ đã được loại bỏ */}

      {/* Nút mở rộng từ trạng thái thu nhỏ đã được loại bỏ */}
      {/* Main button - only shown when chat is not open */}
      {!isOpen && (
        <button
          ref={buttonRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleButtonMouseUp}
          onMouseLeave={handleButtonMouseLeave}
          className={`rockship-floating-button group hoverable ${isDragging ? "dragging" : ""}`}
          style={{
            backgroundColor: config.theme?.primaryColor || "#007bff",
            boxShadow: buttonShadow,
            width: buttonSize + "px",
            height: buttonSize + "px"
          }}
        >
          {config.buttonConfig?.logo ? (
            <div className="rounded-full overflow-hidden flex items-center justify-center w-full h-full">
              <img
                src={config.buttonConfig.logo}
                style={{ width: "100%", height: "100%" }}
                className="object-cover rounded-full"
              />
            </div>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          )}
          {/* Đã loại bỏ tooltip theo yêu cầu */}
        </button>
      )}
    </div>
  )
}
