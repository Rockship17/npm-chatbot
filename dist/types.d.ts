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
    supportAgentName?: string;
    headerLogo?: string;
    buttonConfig?: {
        logo?: string;
        size?: number;
        text?: string;
        shadow?: string;
        position?: {
            x?: number;
            y?: number;
        };
    };
    isResizable?: boolean;
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
