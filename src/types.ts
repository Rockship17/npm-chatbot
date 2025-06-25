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
    language?: 'en' | 'vi'; // Language setting for the chatbot UI (default: 'en')
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
    fullscreenConfig?: {
        width?: string; // Width of fullscreen mode (default: '90vw')
        height?: string; // Height of fullscreen mode (default: '90vh')
    };
    defaultConversationAliasId?: string; // Optional default conversation alias id
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
        conversation_alias_id: string;
    };
}

export interface Conversation {
    id: string;
    customer_id: string;
    conversation_alias_id: string;
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

/**
 * Callbacks for the sendMessage API call
 * Note: The API no longer supports streaming, but this interface is kept for backward compatibility.
 * Only onComplete and onError are now functional; onChunk is deprecated and will be removed in a future version.
 */
export interface StreamingCallbacks {
    /** @deprecated The API no longer supports streaming responses */
    onChunk?: (chunk: string) => void;
    /** Called when the complete response is received */
    onComplete?: (response: ChatResponse) => void;
    /** Called when an error occurs */
    onError?: (error: any) => void;
}