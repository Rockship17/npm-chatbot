import axios, { AxiosInstance } from 'axios';
import {
    MessageResponse,
    ChatResponse,
    ConversationResponse,
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

    async getMessages(platformUserId: string): Promise<MessageResponse> {
        const response = await this.api.get<MessageResponse>(`/rockship/list-message/${platformUserId}`);
        return response.data;
    }

    async sendMessage(
        message: string,
        userName: string,
        platformUserId: string
    ): Promise<ChatResponse> {
        const response = await this.api.post<ChatResponse>('/rockship/website', {
            message,
            user_name: userName,
            platform_user_id: platformUserId
        });
        return response.data;
    }

    async getConversation(platformUserId: string): Promise<ConversationResponse> {
        const response = await this.api.get<ConversationResponse>(`/rockship/get-conversation/${platformUserId}`);
        return response.data;
    }

    async clearConversation(platformUserId: string): Promise<ClearConversationResponse> {
        const response = await this.api.delete<ClearConversationResponse>(`/rockship/delete-conversation/${platformUserId}`);
        return response.data;
    }
}