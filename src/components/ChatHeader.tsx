import React from "react"

interface ChatHeaderProps {
  userName: string
  onClose: () => void
  onClear: () => void
  isClearing: boolean
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ userName, onClose, onClear, isClearing, theme }) => {
  return (
    <div
      className="flex items-center justify-between p-4 border-b text-white"
      style={{ backgroundColor: theme?.primaryColor || "#007bff" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-sm">Rockship Support</h3>
          <p className="text-xs opacity-90">Xin chào {userName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          disabled={isClearing}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors disabled:opacity-50"
          title="Xóa cuộc trò chuyện"
        >
          {isClearing ? (
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
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          )}
        </button>

        <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
