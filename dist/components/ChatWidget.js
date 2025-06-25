"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWidget = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var api_1 = require("../api");
var ChatHeader_1 = require("./ChatHeader");
var ChatInput_1 = require("./ChatInput");
var react_markdown_1 = __importDefault(require("react-markdown"));
var translations_1 = require("../translations");
var ChatWidget = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var config = _a.config, isOpen = _a.isOpen, isMinimized = _a.isMinimized, onClose = _a.onClose, onMinimize = _a.onMinimize;
    var language = config.language || "en";
    var translations = (0, translations_1.getTranslations)(language);
    var _h = (0, react_1.useState)([]), messages = _h[0], setMessages = _h[1];
    var _j = (0, react_1.useState)(false), isLoading = _j[0], setIsLoading = _j[1];
    var _k = (0, react_1.useState)(null), streamingMessageId = _k[0], setStreamingMessageId = _k[1];
    var _l = (0, react_1.useState)(false), isLoadingMore = _l[0], setIsLoadingMore = _l[1];
    var _m = (0, react_1.useState)(false), isClearing = _m[0], setIsClearing = _m[1];
    var _o = (0, react_1.useState)(null), conversationId = _o[0], setConversationId = _o[1];
    var _p = (0, react_1.useState)(""), conversationAliasId = _p[0], setConversationAliasId = _p[1];
    var _q = (0, react_1.useState)(false), initialized = _q[0], setInitialized = _q[1];
    var _r = (0, react_1.useState)(false), showHistory = _r[0], setShowHistory = _r[1];
    var _s = (0, react_1.useState)([]), conversations = _s[0], setConversations = _s[1];
    var _t = (0, react_1.useState)(false), loadingHistory = _t[0], setLoadingHistory = _t[1];
    var _u = (0, react_1.useState)(1), currentPage = _u[0], setCurrentPage = _u[1];
    var _v = (0, react_1.useState)(1), totalPages = _v[0], setTotalPages = _v[1];
    var _w = (0, react_1.useState)(false), isFullscreen = _w[0], setIsFullscreen = _w[1];
    var messagesEndRef = (0, react_1.useRef)(null);
    var messagesContainerRef = (0, react_1.useRef)(null);
    var chatWidgetRef = (0, react_1.useRef)(null);
    var previousScrollHeight = (0, react_1.useRef)(0);
    var apiToken = config.apiToken || "";
    var api = (0, react_1.useRef)(new api_1.ChatbotAPI(apiToken, config.apiBaseUrl));
    var scrollToBottom = function () {
        var _a;
        try {
            (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
        }
        catch (error) {
            console.error("Error scrolling to bottom:", error);
        }
    };
    var loadMessages = (0, react_1.useCallback)(function (convId_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([convId_1], args_1, true), void 0, function (convId, page) {
            var response, sortedMessages_1, error_1;
            if (page === void 0) { page = 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        if (page > 1 && messagesContainerRef.current) {
                            previousScrollHeight.current = messagesContainerRef.current.scrollHeight;
                        }
                        if (page === 1) {
                            setIsLoading(true);
                        }
                        else {
                            setIsLoadingMore(true);
                        }
                        return [4 /*yield*/, api.current.getMessages(config.platformUserId, convId, page)];
                    case 1:
                        response = _a.sent();
                        if (response.data.message && response.data.message.length > 0) {
                            sortedMessages_1 = __spreadArray([], response.data.message, true).sort(function (a, b) { return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); });
                            if (page === 1) {
                                setMessages(sortedMessages_1);
                            }
                            else {
                                setMessages(function (prevMessages) {
                                    var allMessages = __spreadArray(__spreadArray([], sortedMessages_1, true), prevMessages, true);
                                    var uniqueMessages = allMessages.filter(function (message, index, self) { return index === self.findIndex(function (m) { return m.id === message.id; }); });
                                    return uniqueMessages.sort(function (a, b) { return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); });
                                });
                            }
                            setConversationId(response.data.conversation_id);
                            setCurrentPage(page);
                            setTotalPages(Math.ceil(response.paging.total / response.paging.limit));
                        }
                        else if (page === 1) {
                            setMessages([]);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error loading messages:", error_1);
                        if (page === 1) {
                            setMessages([]);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        if (page === 1) {
                            setIsLoading(false);
                        }
                        else {
                            setIsLoadingMore(false);
                        }
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, [config.platformUserId]);
    var loadInitialData = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var conversationsResponse, latestConversation, messagesResponse, sortedMessages, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!config.platformUserId)
                        return [2 /*return*/];
                    setIsLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    console.log("Loading conversations for user:", config.platformUserId);
                    return [4 /*yield*/, api.current.listConversations(config.platformUserId, 1)];
                case 2:
                    conversationsResponse = _c.sent();
                    if (!(((_a = conversationsResponse === null || conversationsResponse === void 0 ? void 0 : conversationsResponse.data) === null || _a === void 0 ? void 0 : _a.conversation) && conversationsResponse.data.conversation.length > 0)) return [3 /*break*/, 4];
                    latestConversation = conversationsResponse.data.conversation[0];
                    console.log("Latest conversation found:", latestConversation);
                    setConversationId(latestConversation.id);
                    setConversationAliasId(latestConversation.conversation_alias_id || "");
                    console.log("Loading messages for conversation ID: ".concat(latestConversation.id));
                    return [4 /*yield*/, api.current.getMessages(config.platformUserId, latestConversation.id, 1)];
                case 3:
                    messagesResponse = _c.sent();
                    if (((_b = messagesResponse === null || messagesResponse === void 0 ? void 0 : messagesResponse.data) === null || _b === void 0 ? void 0 : _b.message) && messagesResponse.data.message.length > 0) {
                        sortedMessages = __spreadArray([], messagesResponse.data.message, true).reverse();
                        console.log("Loaded ".concat(sortedMessages.length, " messages"));
                        setMessages(sortedMessages);
                        if (messagesResponse.paging) {
                            setCurrentPage(messagesResponse.paging.page || 1);
                            setTotalPages(Math.ceil((messagesResponse.paging.total || 0) / 10));
                        }
                    }
                    else {
                        console.log("No messages found in conversation, using welcome message");
                        setMessages([
                            {
                                id: "welcome-" + Date.now().toString(),
                                conversation_id: latestConversation.id,
                                content: config.welcomeMessage || translations.defaultGreeting,
                                type: "assistant",
                                token_usage: 0,
                                created_at: new Date().toISOString(),
                            },
                        ]);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    console.log("No conversations found, will create new conversation on first message");
                    setConversationId("");
                    setConversationAliasId("");
                    setMessages([
                        {
                            id: "welcome-" + Date.now().toString(),
                            conversation_id: "",
                            content: config.welcomeMessage || translations.defaultGreeting,
                            type: "assistant",
                            token_usage: 0,
                            created_at: new Date().toISOString(),
                        },
                    ]);
                    _c.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_2 = _c.sent();
                    console.error("Error loading initial data:", error_2);
                    setConversationId("");
                    setConversationAliasId("");
                    setMessages([
                        {
                            id: "welcome-" + Date.now().toString(),
                            conversation_id: "",
                            content: config.welcomeMessage || translations.defaultGreeting,
                            type: "assistant",
                            token_usage: 0,
                            created_at: new Date().toISOString(),
                        },
                    ]);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [config.platformUserId, config.welcomeMessage, translations.defaultGreeting]);
    var selectConversation = (0, react_1.useCallback)(function (id, alias) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setConversationId(id);
                    setConversationAliasId(alias);
                    setMessages([]);
                    setShowHistory(false);
                    setCurrentPage(1);
                    setTotalPages(1);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadMessages(id, 1)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error fetching messages:", error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [loadMessages]);
    var handleSendMessage = function (message) { return __awaiter(void 0, void 0, void 0, function () {
        var newUserMessage, responseId, aiMessage, response_1, err_1, errorMsg_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!message.trim())
                        return [2 /*return*/];
                    setIsLoading(true);
                    newUserMessage = {
                        id: Date.now().toString(),
                        content: message,
                        type: "user",
                        conversation_id: conversationId || "",
                        token_usage: 0,
                        created_at: new Date().toISOString(),
                    };
                    setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newUserMessage], false); });
                    responseId = (Date.now() + 1).toString();
                    setStreamingMessageId(responseId);
                    aiMessage = {
                        id: responseId,
                        content: "",
                        type: "assistant",
                        conversation_id: conversationId || "",
                        token_usage: 0,
                        created_at: new Date().toISOString(),
                    };
                    setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [aiMessage], false); });
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    console.log("Sending message with conversation_alias_id: \"".concat(conversationAliasId || "", "\" and conversation_id: \"").concat(conversationId || "", "\""));
                    return [4 /*yield*/, api.current.sendMessage(message, config.userName, config.platformUserId, conversationAliasId || "", conversationId || "", {
                            onComplete: function (response) {
                                console.log("Response received:", response);
                            },
                            onError: function (err) {
                                console.error("API error:", err);
                            },
                        })];
                case 2:
                    response_1 = _d.sent();
                    if ((_a = response_1.data) === null || _a === void 0 ? void 0 : _a.conversation_alias_id) {
                        console.log("Setting conversation_alias_id:", response_1.data.conversation_alias_id);
                        setConversationAliasId(response_1.data.conversation_alias_id);
                    }
                    if ((_b = response_1.data) === null || _b === void 0 ? void 0 : _b.conversation_id) {
                        console.log("Setting conversation_id:", response_1.data.conversation_id);
                        setConversationId(response_1.data.conversation_id);
                    }
                    if ((_c = response_1.data) === null || _c === void 0 ? void 0 : _c.ai_reply) {
                        console.log("Setting message from response: ".concat(response_1.data.ai_reply.length, " chars"));
                        setMessages(function (prevMessages) {
                            return prevMessages.map(function (msg) {
                                if (msg.id === responseId) {
                                    return __assign(__assign({}, msg), { content: response_1.data.ai_reply, conversation_id: response_1.data.conversation_id || msg.conversation_id, token_usage: response_1.data.token_usage || 0 });
                                }
                                return msg;
                            });
                        });
                    }
                    setIsLoading(false);
                    setStreamingMessageId(null);
                    scrollToBottom();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    console.error("Error sending message:", err_1);
                    errorMsg_1 = (translations === null || translations === void 0 ? void 0 : translations.errorMessage) || "Sorry, there was an error processing your request.";
                    setMessages(function (prev) {
                        return prev.map(function (msg) {
                            if (msg.id === responseId) {
                                return __assign(__assign({}, msg), { content: errorMsg_1 });
                            }
                            return msg;
                        });
                    });
                    setStreamingMessageId(null);
                    setIsLoading(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleClearConversation = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isClearing || !conversationId)
                        return [2 /*return*/];
                    setIsClearing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api.current.clearConversation(conversationId)];
                case 2:
                    _a.sent();
                    setMessages([]);
                    setConversationId(null);
                    setConversationAliasId("");
                    setCurrentPage(1);
                    setTotalPages(1);
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    console.error("Error clearing conversation:", error_4);
                    return [3 /*break*/, 5];
                case 4:
                    setIsClearing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [conversationId, isClearing]);
    var handleMessagesScroll = (0, react_1.useCallback)(function (e) {
        var scrollTop = e.currentTarget.scrollTop;
        if (scrollTop === 0 && currentPage < totalPages && !isLoadingMore && conversationId) {
            var nextPage = currentPage + 1;
            console.log("Loading page ".concat(nextPage, " of ").concat(totalPages));
            loadMessages(conversationId, nextPage);
        }
    }, [conversationId, currentPage, totalPages, isLoadingMore, loadMessages]);
    var startNewConversation = (0, react_1.useCallback)(function () {
        setConversationId("");
        setConversationAliasId("");
        setMessages([]);
        setShowHistory(false);
        setCurrentPage(1);
        setTotalPages(1);
        // Add welcome message
        var welcomeMessage = {
            id: Date.now().toString(),
            conversation_id: "",
            content: config.welcomeMessage || translations.defaultGreeting,
            type: "assistant",
            token_usage: 0,
            created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
    }, [config.welcomeMessage, translations.defaultGreeting]);
    var loadConversations = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!config.platformUserId)
                        return [2 /*return*/];
                    setLoadingHistory(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api.current.listConversations(config.platformUserId)];
                case 2:
                    response = _a.sent();
                    if (response.data && response.data.conversation) {
                        setConversations(response.data.conversation);
                    }
                    else {
                        setConversations([]);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_5 = _a.sent();
                    console.error("Error loading conversations:", error_5);
                    setConversations([]);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingHistory(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [config.platformUserId]);
    var toggleFullscreen = (0, react_1.useCallback)(function () {
        setIsFullscreen(function (prev) { return !prev; });
    }, []);
    (0, react_1.useEffect)(function () {
        if (isOpen && !initialized) {
            setInitialized(true);
            loadInitialData();
        }
    }, [isOpen, initialized]);
    (0, react_1.useEffect)(function () {
        if (isOpen && initialized && messages.length === 0 && !isLoading && !conversationId) {
            // If we have no messages and no conversation id, set a welcome message
            var welcomeMessage = {
                id: "welcome-" + Date.now().toString(),
                conversation_id: "",
                content: config.welcomeMessage || translations.defaultGreeting,
                type: "assistant",
                token_usage: 0,
                created_at: new Date().toISOString(),
            };
            setMessages([welcomeMessage]);
        }
    }, [
        isOpen,
        initialized,
        messages.length,
        isLoading,
        conversationId,
        config.welcomeMessage,
        translations.defaultGreeting,
    ]);
    (0, react_1.useEffect)(function () {
        if (messages.length > 0 && !isLoadingMore) {
            scrollToBottom();
        }
    }, [messages, isLoadingMore]);
    (0, react_1.useEffect)(function () {
        if (!isLoadingMore && previousScrollHeight.current > 0 && messagesContainerRef.current) {
            var newScrollHeight = messagesContainerRef.current.scrollHeight;
            var heightDifference = newScrollHeight - previousScrollHeight.current;
            messagesContainerRef.current.scrollTop = heightDifference;
            previousScrollHeight.current = 0;
        }
    }, [isLoadingMore]);
    (0, react_1.useEffect)(function () {
        if (showHistory) {
            loadConversations();
        }
    }, [showHistory, loadConversations]);
    var position = config.position || "bottom-right";
    var positionClasses = {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
    };
    if (!isOpen)
        return null;
    if (isMinimized)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { ref: chatWidgetRef, className: "rockship-chatbox ".concat(isOpen ? "open" : "", " fixed ").concat(positionClasses[position]), style: {
            backgroundColor: ((_b = config.theme) === null || _b === void 0 ? void 0 : _b.backgroundColor) || "#ffffff",
            width: isFullscreen ? ((_c = config.fullscreenConfig) === null || _c === void 0 ? void 0 : _c.width) || "90vw" : "400px",
            height: isFullscreen ? ((_d = config.fullscreenConfig) === null || _d === void 0 ? void 0 : _d.height) || "90vh" : "600px",
            position: "fixed",
            zIndex: 1000,
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        }, children: [(0, jsx_runtime_1.jsx)(ChatHeader_1.ChatHeader, { userName: config.userName, onClose: onClose, onClear: handleClearConversation, isClearing: isClearing, theme: config.theme, supportAgentName: config.supportAgentName, headerLogo: config.headerLogo, onShowHistory: function () { return setShowHistory(!showHistory); }, isFullscreen: isFullscreen, onToggleFullscreen: toggleFullscreen, language: language }), showHistory && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-[72px] mx-4 bg-white z-20 flex flex-col rounded-lg shadow-lg overflow-hidden border w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-3 border-b flex justify-between items-center bg-gray-50", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium", children: translations.conversationHistory }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowHistory(false); }, className: "p-1 hover:bg-gray-200 rounded-full transition-colors", title: translations.minimize, children: (0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-60 overflow-auto p-3", children: loadingHistory ? ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center items-center h-20", children: (0, jsx_runtime_1.jsx)("div", { className: "loader" }) })) : conversations.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: conversations.map(function (conv) { return ((0, jsx_runtime_1.jsxs)("div", { onClick: function () { return selectConversation(conv.id, conv.conversation_alias_id); }, className: "p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ".concat(conv.id === conversationId ? "border-blue-500 bg-blue-50" : ""), children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium truncate", children: conv.title || conv.last_message || translations.backToChat }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 mt-1 truncate", children: [new Date(conv.updated_at).toLocaleDateString(), " ", new Date(conv.updated_at).toLocaleTimeString()] })] }, conv.id)); }) })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 py-4", children: translations.noConversations })) }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 border-t", children: (0, jsx_runtime_1.jsxs)("button", { onClick: startNewConversation, className: "w-full py-2 text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2", style: { backgroundColor: ((_e = config.theme) === null || _e === void 0 ? void 0 : _e.primaryColor) || "#007bff" }, children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" }) }), translations.backToChat] }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col flex-1 overflow-y-auto p-4 space-y-4 pb-20", ref: messagesContainerRef, onScroll: handleMessagesScroll, style: { height: "calc(100% - 60px)" }, children: [isLoadingMore && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-2", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin h-6 w-6 border-2 border-t-transparent rounded-full", style: {
                                borderColor: "".concat(((_f = config.theme) === null || _f === void 0 ? void 0 : _f.primaryColor) || "#007bff", " transparent transparent transparent"),
                            } }) })), isLoading && messages.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "rockship-loading-messages", children: (0, jsx_runtime_1.jsx)("div", { className: "rockship-loading-spinner", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin h-8 w-8 border-3 border-t-transparent rounded-full", style: {
                                    borderColor: "".concat(((_g = config.theme) === null || _g === void 0 ? void 0 : _g.primaryColor) || "#007bff", " transparent transparent transparent"),
                                } }) }) })), messages.map(function (message) {
                        var _a;
                        return ((0, jsx_runtime_1.jsx)("div", { className: "flex ".concat(message.type === "assistant" ? "justify-start" : "justify-end"), children: (0, jsx_runtime_1.jsx)("div", { style: {
                                    backgroundColor: message.type === "assistant" ? "#F8F9FA" : ((_a = config.theme) === null || _a === void 0 ? void 0 : _a.primaryColor) || "#007bff",
                                    color: message.type === "assistant" ? "#212529" : "#FFFFFF",
                                    padding: "12px 16px",
                                    borderRadius: message.type === "assistant" ? "12px 12px 12px 0" : "12px 12px 0 12px",
                                    maxWidth: "80%",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }, className: "markdown-content", children: message.type === "assistant" ? (message.id === streamingMessageId && !message.content ? ((0, jsx_runtime_1.jsxs)("div", { className: "rockship-loading rockship-typing", children: [(0, jsx_runtime_1.jsx)("span", { children: translations.typingLabel }), (0, jsx_runtime_1.jsxs)("div", { className: "rockship-loading-dots", children: [(0, jsx_runtime_1.jsx)("span", { className: "rockship-loading-dot" }), (0, jsx_runtime_1.jsx)("span", { className: "rockship-loading-dot" }), (0, jsx_runtime_1.jsx)("span", { className: "rockship-loading-dot" })] })] })) : ((0, jsx_runtime_1.jsx)(react_markdown_1.default, { components: {
                                        a: function (_a) {
                                            var node = _a.node, props = __rest(_a, ["node"]);
                                            return (0, jsx_runtime_1.jsx)("a", __assign({ target: "_blank", rel: "noopener noreferrer" }, props));
                                        },
                                        img: function (_a) {
                                            var node = _a.node, props = __rest(_a, ["node"]);
                                            return (0, jsx_runtime_1.jsx)("img", __assign({}, props, { alt: props.alt || "" }));
                                        },
                                    }, children: message.content }))) : (message.content) }) }, message.id));
                    }), isLoading && messages.length > 0 && !isLoadingMore && !streamingMessageId && ((0, jsx_runtime_1.jsxs)("div", { className: "rockship-loading rockship-typing", children: [(0, jsx_runtime_1.jsx)("span", { children: translations.typingLabel }), (0, jsx_runtime_1.jsxs)("div", { className: "rockship-loading-dots", children: [(0, jsx_runtime_1.jsx)("span", { className: "rockship-loading-dot" }), (0, jsx_runtime_1.jsx)("span", { className: "rockship-loading-dot" }), (0, jsx_runtime_1.jsx)("span", { className: "rockship-loading-dot" })] })] })), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }), (0, jsx_runtime_1.jsx)(ChatInput_1.ChatInput, { onSendMessage: handleSendMessage, isLoading: isLoading, theme: config.theme, language: language })] }));
};
exports.ChatWidget = ChatWidget;
