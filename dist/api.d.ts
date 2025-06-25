import { MessageResponse, ChatResponse, ConversationListResponse, ClearConversationResponse, StreamingCallbacks } from './types';
export declare class ChatbotAPI {
    private api;
    private authToken;
    private baseURL;
    constructor(authToken: string, baseURL?: string);
    listConversations(platformUserId: string, page?: number): Promise<ConversationListResponse>;
    getMessages(platformUserId: string, conversationId: string, page?: number): Promise<MessageResponse>;
    /**
     * Send a message to the chatbot
     * @param message The message to send
     * @param userName User's name
     * @param platformUserId Platform user ID
     * @param conversationAliasId Conversation alias - For existing conversations, pass the current alias. For new conversations, pass empty string.
     * @param conversationId Conversation ID - For existing conversations, pass the current ID. For new conversations, pass empty string.
     * @param callbacks Optional callbacks for response handling
     * @note IMPORTANT: Both conversationAliasId and conversationId must be passed for existing conversations.
     *       Otherwise, a new conversation will be created.
     */
    sendMessage(message: string, userName: string, platformUserId: string, conversationAliasId?: string, conversationId?: string, callbacks?: StreamingCallbacks): Promise<ChatResponse>;
    clearConversation(conversationId: string): Promise<ClearConversationResponse>;
}
