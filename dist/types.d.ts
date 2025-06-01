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
    defaultConversationAlias?: string;
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
        next_cursor: string;
    };
}
export interface ChatResponse {
    data: {
        ai_reply: string;
        token_usage: number;
        conversation_id: string;
        conversation_alias: string;
    };
}
export interface Conversation {
    id: string;
    customer_id: string;
    conversation_alias: string;
    platform_type: string;
    title: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    last_message?: string;
}
export interface ConversationListResponse {
    data: {
        conversation: Conversation[];
    };
    paging: {
        page: number;
        limit: number;
        total: number;
        cursor: string;
        next_cursor: string;
    };
}
export interface ClearConversationResponse {
    data: string;
}
