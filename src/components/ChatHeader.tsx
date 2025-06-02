import React from "react"

interface ChatHeaderProps {
  userName: string
  onClose: () => void
  onClear: () => void
  onShowHistory: () => void
  isClearing: boolean
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  supportAgentName?: string // Support agent name, defaults to "Rockship Support"
  headerLogo?: string // Custom logo URL for the header
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  userName,
  onClose,
  onClear,
  onShowHistory,
  isClearing,
  theme,
  supportAgentName = "Rockship Support",
  headerLogo,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div
      className="flex items-center justify-between p-4 border-b text-white"
      style={{ backgroundColor: theme?.primaryColor || "#007bff" }}
    >
      <div className="flex items-center gap-3">
        {headerLogo ? (
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            <img src={headerLogo} alt={supportAgentName} style={{ width: "100%", height: "100%" }} className="object-cover rounded-full" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-sm">{supportAgentName}</h3>
          <p className="text-xs opacity-90">Xin chào {userName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onShowHistory}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          title="Lịch sử trò chuyện"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
        </button>
        
        {/* Fullscreen toggle button */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          title={isFullscreen ? "Thu nhỏ" : "Phóng to"}
        >
          {isFullscreen ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
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
