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

    /**
     * Send a message to the chatbot
     * @param message The message to send
     * @param userName User's name
     * @param platformUserId Platform user ID
     * @param conversationAliasId Conversation alias - For existing conversations, pass the current alias. For new conversations, pass empty string.
     * @param conversationId Conversation ID - For existing conversations, pass the current ID. For new conversations, pass empty string.
     * @param callbacks Optional callbacks for streaming response
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
        // For non-streaming requests, use axios
        if (!callbacks) {
            const response = await this.api.post<ChatResponse>('/rockship/website', {
                message,
                user_name: userName,
                platform_user_id: platformUserId,
                conversation_alias_id: conversationAliasId,
                conversation_id: conversationId,
                send_uuid: true
            });

            return response.data;
        }

        return new Promise((resolve, reject) => {
            // Create response data object
            const responseData = {
                data: {
                    ai_reply: '',
                    conversation_id: conversationId || '',
                    conversation_alias_id: conversationAliasId,
                    token_usage: 0
                },
                success: true,
                error: null
            };

            // We'll use fetch with ReadableStream for streaming instead of EventSource
            const streamUrl = `${this.baseURL}/rockship/website/stream`;
            console.log('Sending streaming request to:', streamUrl);

            // Send the POST request with proper credentials and headers
            fetch(streamUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    message,
                    user_name: userName,
                    platform_user_id: platformUserId,
                    conversation_alias_id: conversationAliasId,
                    conversation_id: conversationId,
                    send_uuid: true
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                if (!response.body) {
                    throw new Error('ReadableStream not supported');
                }

                // Get a reader to process the stream
                const reader = response.body.getReader();
                // Set up a text decoder for the stream
                // Using 'fatal: false' to ensure we don't throw on invalid UTF-8 sequences
                // This is important for Vietnamese characters that might be split across chunks
                const decoder = new TextDecoder('utf-8', { fatal: false });
                let buffer = '';

                // This buffer is for accumulating incomplete UTF-8 sequences across chunk boundaries
                let pendingBytes: number[] = [];
                
                // Function to process each chunk with special handling for Vietnamese text
                function processChunk({ done, value }: ReadableStreamReadResult<Uint8Array>) {
                    // Stream is done
                    if (done) {
                        console.log('Stream complete');
                        // Make sure to process any remaining data in the buffer
                        if (buffer.trim()) {
                            try {
                                const finalData = JSON.parse(buffer);
                                console.log('Final data:', finalData);

                                if (finalData.conversation_id) {
                                    responseData.data.conversation_id = finalData.conversation_id;
                                }
                                if (finalData.conversation_alias_id) {
                                    responseData.data.conversation_alias_id = finalData.conversation_alias_id;
                                }
                                if (finalData.token_usage) {
                                    responseData.data.token_usage = finalData.token_usage;
                                }
                            } catch (e) {
                                console.warn('Error parsing final buffer:', e);
                            }
                        }

                        // Call completion callback with final data
                        callbacks?.onComplete?.(responseData);
                        resolve(responseData);
                        return;
                    }

                    // Process the new chunk
                    const chunk = decoder.decode(value, { stream: true });
                    console.log('Raw chunk received:', chunk);
                    buffer += chunk;
                    
                    // Try to extract complete JSON objects from the buffer
                    try {
                        // Check for agent_chunk events (streaming content)
                        if (buffer.includes('event:agent_chunk') || buffer.includes('event: agent_chunk')) {
                            // Process agent_chunk events
                            const chunkRegex = /(?:event:agent_chunk|event: agent_chunk)[\r\n]+data:([^\r\n]+)/g;
                            let match;
                            while ((match = chunkRegex.exec(buffer)) !== null) {
                                try {
                                    const chunkData = JSON.parse(match[1]);
                                    if (chunkData.chunk) {
                                        // Store the original chunk for debugging
                                        const originalChunk = chunkData.chunk;
                                        console.log('Processing agent_chunk:', originalChunk);
                                        
                                        // Add chunk to the full response
                                        responseData.data.ai_reply += originalChunk;
                                        
                                        // Pass the UTF-8 chunk to the callback
                                        callbacks?.onChunk?.(originalChunk);
                                    }
                                    
                                    // Remove the processed chunk from the buffer
                                    buffer = buffer.substring(match.index + match[0].length);
                                } catch (e) {
                                    console.warn('Error parsing agent_chunk data:', e);
                                }
                            }
                        }
                        
                        // Handle token usage if present
                        if (buffer.includes('event:token_usage') || buffer.includes('event: token_usage')) {
                            const tokenMatch = buffer.match(/(?:event:token_usage|event: token_usage)[\r\n]+data:([^\r\n]+)/);
                            if (tokenMatch && tokenMatch[1]) {
                                try {
                                    const tokenData = JSON.parse(tokenMatch[1]);
                                    if (tokenData.token_usage) {
                                        console.log('Processing token usage:', tokenData.token_usage);
                                        responseData.data.token_usage = tokenData.token_usage;
                                    }
                                } catch (e) {
                                    console.warn('Error parsing token usage data:', e);
                                }
                            }
                        }
                        
                        // Look for stream_complete signal
                        if (buffer.includes('event:stream_complete') || buffer.includes('event: stream_complete')) {
                            // Extract the data part after event: stream_complete\ndata: 
                            const completeDataMatch = buffer.match(/(?:event:stream_complete|event: stream_complete)[\r\n]+data:([^\r\n]+)/);
                            if (completeDataMatch && completeDataMatch[1]) {
                                try {
                                    const completeData = JSON.parse(completeDataMatch[1].trim());
                                    console.log('Stream complete data:', completeData);
                                    
                                    // Handle data when it's nested in a data property
                                    const finalData = completeData.data || completeData;
                                    
                                    if (finalData.conversation_id) {
                                        responseData.data.conversation_id = finalData.conversation_id;
                                    }
                                    if (finalData.conversation_alias_id) {
                                        responseData.data.conversation_alias_id = finalData.conversation_alias_id;
                                    }
                                    if (finalData.token_usage) {
                                        responseData.data.token_usage = finalData.token_usage;
                                    }
                                    if (finalData.ai_reply && !responseData.data.ai_reply) {
                                        // If we didn't get streaming chunks but have a complete reply
                                        responseData.data.ai_reply = finalData.ai_reply;
                                    }
                                    
                                    // Clear buffer after processing the complete event
                                    buffer = '';
                                    
                                    // Call completion callback and resolve
                                    console.log('Stream complete with final response:', responseData);
                                    callbacks?.onComplete?.(responseData);
                                    resolve(responseData);
                                    return;
                                } catch (e) {
                                    console.warn('Error parsing stream_complete data:', e);
                                }
                            }
                        } else {
                            // Try to find and process message data
                            const lines = buffer.split('\n');
                            const dataLines = lines.filter(line => line.startsWith('data: '));
                            if (dataLines.length > 0) {
                                for (const line of dataLines) {
                                    try {
                                        const jsonStr = line.replace(/^data: /, '').trim();
                                        if (!jsonStr) continue;
                                        
                                        const data = JSON.parse(jsonStr);
                                        console.log('Parsed chunk data:', data);
                                        
                                        // Handle different data types
                                        if (data.chunk) {
                                            console.log('Received chunk:', data.chunk);
                                            responseData.data.ai_reply += data.chunk;
                                            callbacks?.onChunk?.(data.chunk);
                                        }
                                        
                                        // Handle token usage if provided
                                        if (data.token_usage) {
                                            responseData.data.token_usage = data.token_usage;
                                        }
                                        
                                        // Handle conversation ID if provided
                                        if (data.conversation_id) {
                                            responseData.data.conversation_id = data.conversation_id;
                                        }
                                    } catch (e) {
                                        console.warn('Error parsing chunk:', e);
                                    }
                                }
                                
                                // Clear the buffer after processing
                                buffer = '';
                            }
                        }
                    } catch (error) {
                        console.error('Error processing stream chunk:', error);
                    }

                    // Continue reading
                    reader.read().then(processChunk).catch(handleError);
                }

                // Function to handle errors
                function handleError(error: Error) {
                    console.error('Stream error:', error);
                    // Convert error to a more compatible type for the callback
                    callbacks?.onError?.({ type: 'error', message: error.message } as unknown as Event);
                    reject(error);
                }

                // Start the reading process
                reader.read().then(processChunk).catch(handleError);
            }).catch(error => {
                console.error('Error with fetch request:', error);
                callbacks.onError?.(error);
                reject(error);
            });
        });
    }

    async clearConversation(conversationId: string): Promise<ClearConversationResponse> {
        const response = await this.api.delete<ClearConversationResponse>(`/rockship/delete-conversation/${conversationId}`);
        return response.data;
    }
}