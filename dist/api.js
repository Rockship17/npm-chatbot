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
     * @param callbacks Optional callbacks for response handling
     * @note IMPORTANT: Both conversationAliasId and conversationId must be passed for existing conversations.
     *       Otherwise, a new conversation will be created.
     */
    ChatbotAPI.prototype.sendMessage = function (message_1, userName_1, platformUserId_1) {
        return __awaiter(this, arguments, void 0, function (message, userName, platformUserId, conversationAliasId, conversationId, callbacks) {
            var payload, response, error_1;
            var _a, _b;
            if (conversationAliasId === void 0) { conversationAliasId = ""; }
            if (conversationId === void 0) { conversationId = ""; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        // Use regular request - API no longer supports streaming
                        console.log('Sending message to API:', { message: message, userName: userName, platformUserId: platformUserId, conversationAliasId: conversationAliasId, conversationId: conversationId });
                        payload = {
                            message: message,
                            user_name: userName,
                            platform_user_id: platformUserId,
                            conversation_alias_id: conversationAliasId,
                            conversation_id: conversationId
                        };
                        return [4 /*yield*/, this.api.post('/rockship/website', payload)];
                    case 1:
                        response = _c.sent();
                        console.log('API response:', response.data);
                        // If callbacks are provided, trigger them
                        if (callbacks) {
                            if ((_a = response.data.data) === null || _a === void 0 ? void 0 : _a.ai_reply) {
                                // Call onComplete with the full response
                                (_b = callbacks.onComplete) === null || _b === void 0 ? void 0 : _b.call(callbacks, response.data);
                            }
                        }
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _c.sent();
                        console.error('Error sending message:', error_1);
                        // Handle error with callback if provided
                        if (callbacks === null || callbacks === void 0 ? void 0 : callbacks.onError) {
                            callbacks.onError(error_1);
                        }
                        // Rethrow for other error handling
                        throw error_1;
                    case 3: return [2 /*return*/];
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
