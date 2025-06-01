import axios, { AxiosInstance } from 'axios';
import {
    MessageResponse,
    ChatResponse,
    ConversationListResponse,
    ClearConversationResponse
} from './types';

export class ChatbotAPI {
    private api: AxiosInstance;
    private authToken: string;

    constructor(authToken: string, baseURL: string = 'https://bot.rockship.xyz/api/v1') {
        this.authToken = authToken;
        this.api = axios.create({
            baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
    }

    async listConversations(platformUserId: string, page: number = 1): Promise<ConversationListResponse> {
        const response = await this.api.get<ConversationListResponse>(
            `/rockship/list-conversation/${platformUserId}`,
            { params: { page } }
        );
        return response.data;
    }

    async getMessages(platformUserId: string, conversationId: string, page: number = 1): Promise<MessageResponse> {
        const response = await this.api.get<MessageResponse>(
            `/rockship/list-message/${platformUserId}/${conversationId}`,
            { params: { page } }
        );
        return response.data;
    }

    async sendMessage(
        message: string,
        userName: string,
        platformUserId: string,
        conversationAlias: string = ""
    ): Promise<ChatResponse> {
        const response = await this.api.post<ChatResponse>('/rockship/website', {
            message,
            user_name: userName,
            platform_user_id: platformUserId,
            conversation_alias: conversationAlias
        });
        return response.data;
    }

    async clearConversation(conversationId: string): Promise<ClearConversationResponse> {
        const response = await this.api.delete<ClearConversationResponse>(`/rockship/delete-conversation/${conversationId}`);
        return response.data;
    }
}