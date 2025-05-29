import axios, { AxiosInstance } from 'axios';
import {
    MessageResponse,
    ChatResponse,
    ConversationResponse,
    ClearConversationResponse
} from './types';

export class ChatbotAPI {
    private api: AxiosInstance;

    constructor(baseURL: string = 'https://cyhome.rockship.xyz/api/v1') {
        this.api = axios.create({
            baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async getMessages(platformUserId: string, cursor?: string): Promise<MessageResponse> {
        const url = cursor
            ? `/message/${platformUserId}?cursor=${cursor}`
            : `/message/${platformUserId}`;

        const response = await this.api.get<MessageResponse>(url);
        return response.data;
    }

    async sendMessage(
        message: string,
        userName: string,
        platformUserId: string
    ): Promise<ChatResponse> {
        const response = await this.api.post<ChatResponse>('/cyhome/invoke', {
            message,
            user_name: userName,
            platform_user_id: platformUserId
        });
        return response.data;
    }

    async getConversation(platformUserId: string): Promise<ConversationResponse> {
        const response = await this.api.get<ConversationResponse>(`/conversation/${platformUserId}`);
        return response.data;
    }

    async clearConversation(conversationId: string): Promise<ClearConversationResponse> {
        const response = await this.api.delete<ClearConversationResponse>(`/conversation/${conversationId}`);
        return response.data;
    }
}