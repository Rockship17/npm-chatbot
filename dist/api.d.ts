import { MessageResponse, ChatResponse, ConversationResponse, ClearConversationResponse } from './types';
export declare class ChatbotAPI {
    private api;
    private authToken;
    constructor(authToken: string, baseURL?: string);
    getMessages(platformUserId: string): Promise<MessageResponse>;
    sendMessage(message: string, userName: string, platformUserId: string): Promise<ChatResponse>;
    getConversation(platformUserId: string): Promise<ConversationResponse>;
    clearConversation(platformUserId: string): Promise<ClearConversationResponse>;
}
