export interface CyHomeChatbotConfig {
    userId: string;
    userName: string;
    apiBaseUrl?: string;
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      textColor?: string;
      backgroundColor?: string;
    };
    position?: {
      right?: string;
      bottom?: string;
    };
  }
  
  export interface Message {
    id: string;
    conversation_id: string;
    content: string;
    type: 'user' | 'assistant';
    token_usage: number;
    created_at: string;
  }
  
  export interface ApiResponse {
    data: {
      conversation_id: string;
      message: Message[];
    };
    paging: {
      page: number;
      limit: number;
      total: number;
      cursor: string;
      NextCursor: string;
    };
  }
  
  export class CyHomeChatbot {
    private config: CyHomeChatbotConfig;
    private apiBaseUrl: string;
    private container: HTMLDivElement | null = null;
    private chatBox: HTMLDivElement | null = null;
    private floatingButton: HTMLDivElement | null = null;
    private messagesContainer: HTMLDivElement | null = null;
    private messageInput: HTMLInputElement | null = null;
    private isOpen = false;
    private messages: Message[] = [];
    private conversationId: string | null = null;
    private isDragging = false;
    private dragOffset = 0;
  
    constructor(config: CyHomeChatbotConfig) {
      this.config = config;
      this.apiBaseUrl = config.apiBaseUrl || 'https://cyhome.rockship.xyz/api/v1';
      this.init();
    }
  
    private init(): void {
      this.createStyles();
      this.createUI();
      this.loadMessages();
    }
  
    private createStyles(): void {
      const style = document.createElement('style');
      style.setAttribute('data-cyhome-chatbot', 'true');
      style.textContent = `
        .cyhome-chatbot-container {
          position: fixed;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
  
        .cyhome-floating-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${this.config.theme?.primaryColor || '#007bff'};
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          user-select: none;
          font-size: 24px;
        }
  
        .cyhome-floating-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
  
        .cyhome-floating-button.dragging {
          cursor: grabbing;
        }
  
        .cyhome-chatbox {
          position: absolute;
          right: 70px;
          bottom: 0;
          width: 350px;
          height: 500px;
          background: ${this.config.theme?.backgroundColor || 'white'};
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e1e5e9;
        }
  
        .cyhome-chatbox.open {
          display: flex;
        }
  
        .cyhome-chatbox-header {
          padding: 16px;
          background: ${this.config.theme?.primaryColor || '#007bff'};
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
  
        .cyhome-chatbox-title {
          font-weight: 600;
          font-size: 16px;
        }
  
        .cyhome-chatbox-actions {
          display: flex;
          gap: 8px;
        }
  
        .cyhome-action-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: background-color 0.2s;
        }
  
        .cyhome-action-btn:hover {
          background: rgba(255,255,255,0.3);
        }
  
        .cyhome-messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8f9fa;
        }
  
        .cyhome-message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
        }
  
        .cyhome-message.user {
          align-self: flex-end;
          background: ${this.config.theme?.primaryColor || '#007bff'};
          color: white;
          border-bottom-right-radius: 6px;
        }
  
        .cyhome-message.assistant {
          align-self: flex-start;
          background: white;
          color: ${this.config.theme?.textColor || '#333'};
          border: 1px solid #e1e5e9;
          border-bottom-left-radius: 6px;
        }
  
        .cyhome-input-container {
          padding: 16px;
          border-top: 1px solid #e1e5e9;
          display: flex;
          gap: 8px;
          background: white;
        }
  
        .cyhome-message-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e1e5e9;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
        }
  
        .cyhome-message-input:focus {
          border-color: ${this.config.theme?.primaryColor || '#007bff'};
        }
  
        .cyhome-send-btn {
          background: ${this.config.theme?.primaryColor || '#007bff'};
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
          font-size: 16px;
        }
  
        .cyhome-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
  
        .cyhome-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
          padding: 12px 16px;
          background: white;
          border-radius: 18px;
          align-self: flex-start;
          border: 1px solid #e1e5e9;
        }
  
        .cyhome-loading-dots {
          display: flex;
          gap: 2px;
        }
  
        .cyhome-loading-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #666;
          animation: bounce 1.4s infinite ease-in-out both;
        }
  
        .cyhome-loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .cyhome-loading-dot:nth-child(2) { animation-delay: -0.16s; }
  
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
  
        .cyhome-error {
          color: #dc3545;
          font-size: 12px;
          padding: 8px 16px;
          background: #f8d7da;
          border-radius: 4px;
          margin: 8px 16px;
        }
  
        .cyhome-welcome-message {
          text-align: center;
          color: #666;
          font-size: 14px;
          padding: 20px;
          font-style: italic;
        }
      `;
      document.head.appendChild(style);
    }
  
    private createUI(): void {
      this.container = document.createElement('div');
      this.container.className = 'cyhome-chatbot-container';
      this.container.style.right = this.config.position?.right || '20px';
      this.container.style.bottom = this.config.position?.bottom || '20px';
  
      // Floating button
      this.floatingButton = document.createElement('div');
      this.floatingButton.className = 'cyhome-floating-button';
      this.floatingButton.innerHTML = '💬';
      this.floatingButton.title = 'Open Chat';
  
      // Chat box
      this.chatBox = document.createElement('div');
      this.chatBox.className = 'cyhome-chatbox';
  
      // Header
      const header = document.createElement('div');
      header.className = 'cyhome-chatbox-header';
      header.innerHTML = `
        <div class="cyhome-chatbox-title">CyHome Assistant</div>
        <div class="cyhome-chatbox-actions">
          <button class="cyhome-action-btn" id="clear-btn" title="Clear Conversation">🗑️</button>
          <button class="cyhome-action-btn" id="close-btn" title="Close">✕</button>
        </div>
      `;
  
      // Messages container
      this.messagesContainer = document.createElement('div');
      this.messagesContainer.className = 'cyhome-messages-container';
  
      // Input container
      const inputContainer = document.createElement('div');
      inputContainer.className = 'cyhome-input-container';
      
      this.messageInput = document.createElement('input');
      this.messageInput.className = 'cyhome-message-input';
      this.messageInput.type = 'text';
      this.messageInput.placeholder = 'Type your message...';
  
      const sendBtn = document.createElement('button');
      sendBtn.className = 'cyhome-send-btn';
      sendBtn.innerHTML = '→';
  
      inputContainer.appendChild(this.messageInput);
      inputContainer.appendChild(sendBtn);
  
      this.chatBox.appendChild(header);
      this.chatBox.appendChild(this.messagesContainer);
      this.chatBox.appendChild(inputContainer);
  
      this.container.appendChild(this.floatingButton);
      this.container.appendChild(this.chatBox);
  
      document.body.appendChild(this.container);
  
      this.setupEventListeners();
      this.showWelcomeMessage();
    }
  
    private showWelcomeMessage(): void {
      if (!this.messagesContainer) return;
      
      const welcomeEl = document.createElement('div');
      welcomeEl.className = 'cyhome-welcome-message';
      welcomeEl.textContent = 'Chào bạn! Tôi là CyHome Assistant. Hãy nhắn tin để bắt đầu trò chuyện!';
      this.messagesContainer.appendChild(welcomeEl);
    }
  
    private setupEventListeners(): void {
      // Toggle chat
      this.floatingButton?.addEventListener('click', (e) => {
        if (!this.isDragging) {
          this.toggleChat();
        }
      });
  
      // Close chat
      const closeBtn = document.getElementById('close-btn');
      closeBtn?.addEventListener('click', () => this.closeChat());
  
      // Clear conversation
      const clearBtn = document.getElementById('clear-btn');
      clearBtn?.addEventListener('click', () => this.clearConversation());
  
      // Send message
      const sendBtn = this.container?.querySelector('.cyhome-send-btn') as HTMLButtonElement;
      sendBtn?.addEventListener('click', () => this.sendMessage());
  
      // Enter key to send
      this.messageInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
  
      // Drag functionality
      this.setupDragFunctionality();
    }
  
    private setupDragFunctionality(): void {
      let startY = 0;
      let startTop = 0;
  
      const handleMouseDown = (e: MouseEvent) => {
        this.isDragging = true;
        this.floatingButton?.classList.add('dragging');
        startY = e.clientY;
        const rect = this.container?.getBoundingClientRect();
        startTop = rect ? window.innerHeight - rect.bottom : 0;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        e.preventDefault();
      };
  
      const handleMouseMove = (e: MouseEvent) => {
        if (!this.isDragging || !this.container) return;
        
        const deltaY = startY - e.clientY;
        let newBottom = startTop + deltaY;
        
        // Constrain to viewport
        const containerHeight = 60; // Button height
        newBottom = Math.max(20, Math.min(window.innerHeight - containerHeight - 20, newBottom));
        
        this.container.style.bottom = `${newBottom}px`;
      };
  
      const handleMouseUp = () => {
        this.isDragging = false;
        this.floatingButton?.classList.remove('dragging');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        // Delay to prevent click event
        setTimeout(() => {
          this.isDragging = false;
        }, 100);
      };
  
      this.floatingButton?.addEventListener('mousedown', handleMouseDown);
    }
  
    private toggleChat(): void {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.openChat();
      } else {
        this.closeChat();
      }
    }
  
    private openChat(): void {
      this.isOpen = true;
      this.chatBox?.classList.add('open');
      this.messageInput?.focus();
    }
  
    private closeChat(): void {
      this.isOpen = false;
      this.chatBox?.classList.remove('open');
    }
  
    private async loadMessages(): Promise<void> {
      try {
        const response = await fetch(`${this.apiBaseUrl}/message/${this.config.userId}`);
        if (response.ok) {
          const data: ApiResponse = await response.json();
          this.messages = data.data.message.reverse(); // Reverse to show oldest first
          this.conversationId = data.data.conversation_id;
          this.renderMessages();
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  
    private renderMessages(): void {
      if (!this.messagesContainer) return;
      
      // Clear welcome message
      const welcome = this.messagesContainer.querySelector('.cyhome-welcome-message');
      welcome?.remove();
      
      this.messagesContainer.innerHTML = '';
      
      if (this.messages.length === 0) {
        this.showWelcomeMessage();
        return;
      }
  
      this.messages.forEach(message => {
        const messageEl = document.createElement('div');
        messageEl.className = `cyhome-message ${message.type}`;
        messageEl.textContent = message.content;
        this.messagesContainer?.appendChild(messageEl);
      });
  
      // Scroll to bottom
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  
    private showLoading(): void {
      if (!this.messagesContainer) return;
      
      const loadingEl = document.createElement('div');
      loadingEl.className = 'cyhome-loading';
      loadingEl.innerHTML = `
        <span>Assistant đang trả lời</span>
        <div class="cyhome-loading-dots">
          <div class="cyhome-loading-dot"></div>
          <div class="cyhome-loading-dot"></div>
          <div class="cyhome-loading-dot"></div>
        </div>
      `;
      loadingEl.id = 'loading-indicator';
      
      this.messagesContainer.appendChild(loadingEl);
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  
    private hideLoading(): void {
      const loadingEl = document.getElementById('loading-indicator');
      loadingEl?.remove();
    }
  
    private showError(message: string): void {
      if (!this.messagesContainer) return;
      
      const errorEl = document.createElement('div');
      errorEl.className = 'cyhome-error';
      errorEl.textContent = message;
      
      this.messagesContainer.appendChild(errorEl);
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      
      // Remove error after 5 seconds
      setTimeout(() => errorEl.remove(), 5000);
    }
  
    private async sendMessage(): Promise<void> {
      const input = this.messageInput;
      if (!input || !input.value.trim()) return;
  
      const message = input.value.trim();
      input.value = '';
  
      // Add user message to UI
      const userMessage: Message = {
        id: Date.now().toString(),
        conversation_id: this.conversationId || '',
        content: message,
        type: 'user',
        token_usage: 0,
        created_at: new Date().toISOString()
      };
  
      this.messages.push(userMessage);
      this.renderMessages();
      this.showLoading();
  
      try {
        const response = await fetch(`${this.apiBaseUrl}/cyhome/invoke`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            user_name: this.config.userName,
            user_id: this.config.userId
          })
        });
  
        this.hideLoading();
  
        if (response.ok) {
          // Reload messages to get the assistant's response
          await this.loadMessages();
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        this.hideLoading();
        this.showError('Không thể gửi tin nhắn. Vui lòng thử lại.');
        console.error('Error sending message:', error);
      }
    }
  
    private async clearConversation(): Promise<void> {
      if (!this.conversationId) {
        // Get conversation ID first
        try {
          const response = await fetch(`${this.apiBaseUrl}/conversation/${this.config.userId}`);
          if (response.ok) {
            const data = await response.json();
            this.conversationId = data.conversation_id;
          }
        } catch (error) {
          console.error('Error getting conversation ID:', error);
          return;
        }
      }
  
      if (!this.conversationId) return;
  
      try {
        const response = await fetch(`${this.apiBaseUrl}/conversation/${this.conversationId}`, {
          method: 'DELETE'
        });
  
        if (response.ok) {
          this.messages = [];
          this.conversationId = null;
          this.renderMessages();
        } else {
          throw new Error('Failed to clear conversation');
        }
      } catch (error) {
        this.showError('Không thể xóa cuộc trò chuyện. Vui lòng thử lại.');
        console.error('Error clearing conversation:', error);
      }
    }
  
    // Public methods
    public destroy(): void {
      this.container?.remove();
      const style = document.querySelector('style[data-cyhome-chatbot]');
      style?.remove();
    }
  
    public setTheme(theme: CyHomeChatbotConfig['theme']): void {
      this.config.theme = { ...this.config.theme, ...theme };
      // Re-create styles with new theme
      const existingStyle = document.querySelector('style[data-cyhome-chatbot]');
      existingStyle?.remove();
      this.createStyles();
    }
  
    public open(): void {
      this.openChat();
    }
  
    public close(): void {
      this.closeChat();
    }
  }
  
  // Auto-initialize if config is provided in window
  declare global {
    interface Window {
      CyHomeChatbotConfig?: CyHomeChatbotConfig;
    }
  }
  
  if (typeof window !== 'undefined' && window.CyHomeChatbotConfig) {
    new CyHomeChatbot(window.CyHomeChatbotConfig);
  }
  
  export default CyHomeChatbot;