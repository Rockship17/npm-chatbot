import axios, { AxiosInstance } from 'axios';
import {
    MessageResponse,
    ChatResponse,
    ConversationListResponse,
    ClearConversationResponse,
    StreamingCallbacks
} from './types';

export class ChatbotAPI {
    private api: AxiosInstance;
    private authToken: string;
    private baseURL: string;

    constructor(authToken: string, baseURL: string = 'https://bot.rockship.xyz/api/v1') {
        this.authToken = authToken;
        this.baseURL = baseURL;
        this.api = axios.create({
            baseURL,
            // 30s was well below what the assistant actually needs. Replies grow with
            // the thread — measured at ~10s early on and past 45s on a long one — so a
            // routine question aborted here and the user saw an error even though the
            // server went on to answer and store it (2026-08-12: a 31.2s turn returned
            // 200 and landed in history, seconds after the widget had given up).
            //
            // The ceiling is Cloudflare, not us: bot.logicx.vn returns a 524 once the
            // origin takes 120s. Sitting just under that means a slow-but-finishing
            // reply gets through, and anything genuinely stuck still fails as a clean
            // client timeout rather than a Cloudflare error page the SDK cannot read.
            //
            // This buys headroom, it does not remove the wall. Streaming is what
            // removes it — the response starts arriving in the first second, so no
            // layer ever sees a silent connection (see the streaming path removed in
            // c9ed9cf, restorable now that the API supports it again).
            timeout: 110000,
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
    async sendMessage(
        message: string,
        userName: string,
        platformUserId: string,
        conversationAliasId: string = "",
        conversationId: string = "",
        callbacks?: StreamingCallbacks
    ): Promise<ChatResponse> {
        try {
            // Use regular request - API no longer supports streaming
            console.log('Sending message to API:', { message, userName, platformUserId, conversationAliasId, conversationId });

            // Construct the payload
            const payload = {
                message,
                user_name: userName,
                platform_user_id: platformUserId,
                conversation_alias_id: conversationAliasId,
                conversation_id: conversationId
            };

            // Send the request
            const response = await this.api.post<ChatResponse>('/rockship/website', payload);
            console.log('API response:', response.data);

            // If callbacks are provided, trigger them
            if (callbacks) {
                if (response.data.data?.ai_reply) {
                    // Call onComplete with the full response
                    callbacks.onComplete?.(response.data);
                }
            }

            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);

            // Handle error with callback if provided
            if (callbacks?.onError) {
                callbacks.onError(error);
            }

            // Rethrow for other error handling
            throw error;
        }
    }

    async clearConversation(conversationId: string): Promise<ClearConversationResponse> {
        const response = await this.api.delete<ClearConversationResponse>(`/rockship/delete-conversation/${conversationId}`);
        return response.data;
    }
}