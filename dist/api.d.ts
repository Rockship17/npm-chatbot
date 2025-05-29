import { MessageResponse, ChatResponse, ConversationResponse, ClearConversationResponse } from './types';
export declare class ChatbotAPI {
    private api;
    constructor(baseURL?: string);
    getMessages(platformUserId: string, cursor?: string): Promise<MessageResponse>;
    sendMessage(message: string, userName: string, platformUserId: string): Promise<ChatResponse>;
    getConversation(platformUserId: string): Promise<ConversationResponse>;
    clearConversation(conversationId: string): Promise<ClearConversationResponse>;
}
