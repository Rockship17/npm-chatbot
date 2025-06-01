import { MessageResponse, ChatResponse, ConversationListResponse, ClearConversationResponse } from './types';
export declare class ChatbotAPI {
    private api;
    private authToken;
    constructor(authToken: string, baseURL?: string);
    listConversations(platformUserId: string, page?: number): Promise<ConversationListResponse>;
    getMessages(platformUserId: string, conversationId: string, page?: number): Promise<MessageResponse>;
    sendMessage(message: string, userName: string, platformUserId: string, conversationAlias?: string): Promise<ChatResponse>;
    clearConversation(conversationId: string): Promise<ClearConversationResponse>;
}
