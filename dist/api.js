"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotAPI = void 0;
var axios_1 = __importDefault(require("axios"));
var ChatbotAPI = /** @class */ (function () {
    function ChatbotAPI(authToken, baseURL) {
        if (baseURL === void 0) { baseURL = 'https://bot.rockship.xyz/api/v1'; }
        this.authToken = authToken;
        this.baseURL = baseURL;
        this.api = axios_1.default.create({
            baseURL: baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer ".concat(authToken)
            }
        });
    }
    ChatbotAPI.prototype.listConversations = function (platformUserId_1) {
        return __awaiter(this, arguments, void 0, function (platformUserId, page) {
            var response;
            if (page === void 0) { page = 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.get("/rockship/list-conversation/".concat(platformUserId), { params: { page: page } })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    ChatbotAPI.prototype.getMessages = function (platformUserId_1, conversationId_1) {
        return __awaiter(this, arguments, void 0, function (platformUserId, conversationId, page) {
            var response;
            if (page === void 0) { page = 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.get("/rockship/list-message/".concat(platformUserId, "/").concat(conversationId), { params: { page: page } })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
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
    ChatbotAPI.prototype.sendMessage = function (message_1, userName_1, platformUserId_1) {
        return __awaiter(this, arguments, void 0, function (message, userName, platformUserId, conversationAliasId, conversationId, callbacks) {
            var response;
            var _this = this;
            if (conversationAliasId === void 0) { conversationAliasId = ""; }
            if (conversationId === void 0) { conversationId = ""; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!callbacks) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.api.post('/rockship/website', {
                                message: message,
                                user_name: userName,
                                platform_user_id: platformUserId,
                                conversation_alias_id: conversationAliasId,
                                conversation_id: conversationId,
                                send_uuid: true
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                            // Create response data object
                            var responseData = {
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
                            var streamUrl = "".concat(_this.baseURL, "/rockship/website/stream");
                            console.log('Sending streaming request to:', streamUrl);
                            // Send the POST request with proper credentials and headers
                            fetch(streamUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(_this.authToken)
                                },
                                body: JSON.stringify({
                                    message: message,
                                    user_name: userName,
                                    platform_user_id: platformUserId,
                                    conversation_alias_id: conversationAliasId,
                                    conversation_id: conversationId,
                                    send_uuid: true
                                })
                            }).then(function (response) {
                                if (!response.ok) {
                                    throw new Error("HTTP error! Status: ".concat(response.status));
                                }
                                if (!response.body) {
                                    throw new Error('ReadableStream not supported');
                                }
                                // Get a reader to process the stream
                                var reader = response.body.getReader();
                                // Set up a text decoder for the stream
                                // Using 'fatal: false' to ensure we don't throw on invalid UTF-8 sequences
                                // This is important for Vietnamese characters that might be split across chunks
                                var decoder = new TextDecoder('utf-8', { fatal: false });
                                var buffer = '';
                                // This buffer is for accumulating incomplete UTF-8 sequences across chunk boundaries
                                var pendingBytes = [];
                                // Function to process each chunk with special handling for Vietnamese text
                                function processChunk(_a) {
                                    var _b, _c, _d, _e;
                                    var done = _a.done, value = _a.value;
                                    // Stream is done
                                    if (done) {
                                        console.log('Stream complete');
                                        // Make sure to process any remaining data in the buffer
                                        if (buffer.trim()) {
                                            try {
                                                var finalData = JSON.parse(buffer);
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
                                            }
                                            catch (e) {
                                                console.warn('Error parsing final buffer:', e);
                                            }
                                        }
                                        // Call completion callback with final data
                                        (_b = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onComplete) === null || _b === void 0 ? void 0 : _b.call(callbacks, responseData);
                                        resolve(responseData);
                                        return;
                                    }
                                    // Process the new chunk
                                    var chunk = decoder.decode(value, { stream: true });
                                    console.log('Raw chunk received:', chunk);
                                    buffer += chunk;
                                    // Try to extract complete JSON objects from the buffer
                                    try {
                                        // Check for agent_chunk events (streaming content)
                                        if (buffer.includes('event:agent_chunk') || buffer.includes('event: agent_chunk')) {
                                            // Process agent_chunk events
                                            var chunkRegex = /(?:event:agent_chunk|event: agent_chunk)[\r\n]+data:([^\r\n]+)/g;
                                            var match = void 0;
                                            while ((match = chunkRegex.exec(buffer)) !== null) {
                                                try {
                                                    var chunkData = JSON.parse(match[1]);
                                                    if (chunkData.chunk) {
                                                        // Store the original chunk for debugging
                                                        var originalChunk = chunkData.chunk;
                                                        console.log('Processing agent_chunk:', originalChunk);
                                                        // Add chunk to the full response
                                                        responseData.data.ai_reply += originalChunk;
                                                        // Pass the UTF-8 chunk to the callback
                                                        (_c = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onChunk) === null || _c === void 0 ? void 0 : _c.call(callbacks, originalChunk);
                                                    }
                                                    // Remove the processed chunk from the buffer
                                                    buffer = buffer.substring(match.index + match[0].length);
                                                }
                                                catch (e) {
                                                    console.warn('Error parsing agent_chunk data:', e);
                                                }
                                            }
                                        }
                                        // Handle token usage if present
                                        if (buffer.includes('event:token_usage') || buffer.includes('event: token_usage')) {
                                            var tokenMatch = buffer.match(/(?:event:token_usage|event: token_usage)[\r\n]+data:([^\r\n]+)/);
                                            if (tokenMatch && tokenMatch[1]) {
                                                try {
                                                    var tokenData = JSON.parse(tokenMatch[1]);
                                                    if (tokenData.token_usage) {
                                                        console.log('Processing token usage:', tokenData.token_usage);
                                                        responseData.data.token_usage = tokenData.token_usage;
                                                    }
                                                }
                                                catch (e) {
                                                    console.warn('Error parsing token usage data:', e);
                                                }
                                            }
                                        }
                                        // Look for stream_complete signal
                                        if (buffer.includes('event:stream_complete') || buffer.includes('event: stream_complete')) {
                                            // Extract the data part after event: stream_complete\ndata: 
                                            var completeDataMatch = buffer.match(/(?:event:stream_complete|event: stream_complete)[\r\n]+data:([^\r\n]+)/);
                                            if (completeDataMatch && completeDataMatch[1]) {
                                                try {
                                                    var completeData = JSON.parse(completeDataMatch[1].trim());
                                                    console.log('Stream complete data:', completeData);
                                                    // Handle data when it's nested in a data property
                                                    var finalData = completeData.data || completeData;
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
                                                    (_d = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onComplete) === null || _d === void 0 ? void 0 : _d.call(callbacks, responseData);
                                                    resolve(responseData);
                                                    return;
                                                }
                                                catch (e) {
                                                    console.warn('Error parsing stream_complete data:', e);
                                                }
                                            }
                                        }
                                        else {
                                            // Try to find and process message data
                                            var lines = buffer.split('\n');
                                            var dataLines = lines.filter(function (line) { return line.startsWith('data: '); });
                                            if (dataLines.length > 0) {
                                                for (var _i = 0, dataLines_1 = dataLines; _i < dataLines_1.length; _i++) {
                                                    var line = dataLines_1[_i];
                                                    try {
                                                        var jsonStr = line.replace(/^data: /, '').trim();
                                                        if (!jsonStr)
                                                            continue;
                                                        var data = JSON.parse(jsonStr);
                                                        console.log('Parsed chunk data:', data);
                                                        // Handle different data types
                                                        if (data.chunk) {
                                                            console.log('Received chunk:', data.chunk);
                                                            responseData.data.ai_reply += data.chunk;
                                                            (_e = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onChunk) === null || _e === void 0 ? void 0 : _e.call(callbacks, data.chunk);
                                                        }
                                                        // Handle token usage if provided
                                                        if (data.token_usage) {
                                                            responseData.data.token_usage = data.token_usage;
                                                        }
                                                        // Handle conversation ID if provided
                                                        if (data.conversation_id) {
                                                            responseData.data.conversation_id = data.conversation_id;
                                                        }
                                                    }
                                                    catch (e) {
                                                        console.warn('Error parsing chunk:', e);
                                                    }
                                                }
                                                // Clear the buffer after processing
                                                buffer = '';
                                            }
                                        }
                                    }
                                    catch (error) {
                                        console.error('Error processing stream chunk:', error);
                                    }
                                    // Continue reading
                                    reader.read().then(processChunk).catch(handleError);
                                }
                                // Function to handle errors
                                function handleError(error) {
                                    var _a;
                                    console.error('Stream error:', error);
                                    // Convert error to a more compatible type for the callback
                                    (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onError) === null || _a === void 0 ? void 0 : _a.call(callbacks, { type: 'error', message: error.message });
                                    reject(error);
                                }
                                // Start the reading process
                                reader.read().then(processChunk).catch(handleError);
                            }).catch(function (error) {
                                var _a;
                                console.error('Error with fetch request:', error);
                                (_a = callbacks.onError) === null || _a === void 0 ? void 0 : _a.call(callbacks, error);
                                reject(error);
                            });
                        })];
                }
            });
        });
    };
    ChatbotAPI.prototype.clearConversation = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.delete("/rockship/delete-conversation/".concat(conversationId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return ChatbotAPI;
}());
exports.ChatbotAPI = ChatbotAPI;
