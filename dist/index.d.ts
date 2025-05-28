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
export declare class CyHomeChatbot {
    private config;
    private apiBaseUrl;
    private container;
    private chatBox;
    private floatingButton;
    private messagesContainer;
    private messageInput;
    private isOpen;
    private messages;
    private conversationId;
    private isDragging;
    private dragOffset;
    constructor(config: CyHomeChatbotConfig);
    private init;
    private createStyles;
    private createUI;
    private showWelcomeMessage;
    private setupEventListeners;
    private setupDragFunctionality;
    private toggleChat;
    private openChat;
    private closeChat;
    private loadMessages;
    private renderMessages;
    private showLoading;
    private hideLoading;
    private showError;
    private sendMessage;
    private clearConversation;
    destroy(): void;
    setTheme(theme: CyHomeChatbotConfig['theme']): void;
    open(): void;
    close(): void;
}
declare global {
    interface Window {
        CyHomeChatbotConfig?: CyHomeChatbotConfig;
    }
}
export default CyHomeChatbot;
