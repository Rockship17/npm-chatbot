export interface ChatbotConfig {
    userName: string;
    platformUserId: string;
    apiToken: string;
    apiBaseUrl?: string;
    theme?: {
        primaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
    };
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    welcomeMessage?: string;
    // New customization options
    supportAgentName?: string; // Name of the support agent (default: Rockship Support)
    headerLogo?: string; // URL to custom logo for the chat header
    buttonConfig?: {
        logo?: string; // URL to custom logo
        size?: number; // Button size in pixels
        text?: string; // Button text
        shadow?: string; // Custom shadow
        position?: {
            x?: number;
            y?: number;
        };
    };
    isResizable?: boolean; // Whether the chat widget can be resized
}

export interface Message {
    id: string;
    conversation_id: string;
    content: string;
    type: 'user' | 'assistant';
    token_usage: number;
    created_at: string;
}

export interface MessageResponse {
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

export interface ChatResponse {
    data: {
        ai_reply: string;
        token_usage: number;
    };
}

export interface Conversation {
    id: string;
    customer_id: string;
    coze_conversation_id: string;
    platform_type: string;
    created_at: string;
    updated_at: string;
}

export interface ConversationResponse {
    data: Conversation;
}

export interface ClearConversationResponse {
    data: string;
}