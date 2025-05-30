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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWidget = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var api_1 = require("../api");
var ChatHeader_1 = require("./ChatHeader");
var ChatMessage_1 = require("./ChatMessage");
var ChatInput_1 = require("./ChatInput");
// Fix links to open in new tabs
var externalLinkHandler = function () {
    // Add target="_blank" and rel="noopener noreferrer" to all links in the chatbox
    setTimeout(function () {
        var chatboxLinks = document.querySelectorAll('.rockship-chatbox a');
        chatboxLinks.forEach(function (link) {
            var anchor = link;
            if (!anchor.getAttribute('target')) {
                anchor.setAttribute('target', '_blank');
                anchor.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }, 100);
};
var ChatWidget = function (_a) {
    var _b, _c, _d;
    var config = _a.config, isOpen = _a.isOpen, isMinimized = _a.isMinimized, onClose = _a.onClose, onMinimize = _a.onMinimize;
    // State cho chat
    var _e = (0, react_1.useState)([]), messages = _e[0], setMessages = _e[1];
    var _f = (0, react_1.useState)(false), isLoading = _f[0], setIsLoading = _f[1];
    var _g = (0, react_1.useState)(false), isClearing = _g[0], setIsClearing = _g[1];
    var _h = (0, react_1.useState)(null), conversationId = _h[0], setConversationId = _h[1];
    var _j = (0, react_1.useState)(false), initialized = _j[0], setInitialized = _j[1];
    // State cho resizable chat widget - di chuyển lên đầu component
    var _k = (0, react_1.useState)({ width: 400, height: 600 }), chatSize = _k[0], setChatSize = _k[1];
    // Refs
    var messagesEndRef = (0, react_1.useRef)(null);
    var messagesContainerRef = (0, react_1.useRef)(null);
    var chatWidgetRef = (0, react_1.useRef)(null);
    // Check if apiToken is available in config
    var apiToken = config.apiToken || '';
    var api = (0, react_1.useRef)(new api_1.ChatbotAPI(apiToken, config.apiBaseUrl));
    var scrollToBottom = function () {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    };
    var loadMessages = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, sortedMessages, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    return [4 /*yield*/, api.current.getMessages(config.platformUserId)];
                case 1:
                    response = _a.sent();
                    if (response.data.message && response.data.message.length > 0) {
                        sortedMessages = __spreadArray([], response.data.message, true).reverse();
                        setMessages(sortedMessages);
                        setConversationId(response.data.conversation_id);
                    }
                    else {
                        setMessages([]);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error loading messages:", error_1);
                    setMessages([]);
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [config.platformUserId]);
    var handleSendMessage = function (message) { return __awaiter(void 0, void 0, void 0, function () {
        var userMessage, response, aiMessage_1, convResponse, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isLoading)
                        return [2 /*return*/];
                    setIsLoading(true);
                    userMessage = {
                        id: Date.now().toString(),
                        conversation_id: conversationId || "",
                        content: message,
                        type: "user",
                        token_usage: 0,
                        created_at: new Date().toISOString(),
                    };
                    setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [userMessage], false); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, api.current.sendMessage(message, config.userName, config.platformUserId)
                        // Add AI response
                    ];
                case 2:
                    response = _a.sent();
                    aiMessage_1 = {
                        id: (Date.now() + 1).toString(),
                        conversation_id: conversationId || "",
                        content: response.data.ai_reply,
                        type: "assistant",
                        token_usage: response.data.token_usage,
                        created_at: new Date().toISOString(),
                    };
                    setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [aiMessage_1], false); });
                    if (!!conversationId) return [3 /*break*/, 6];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, api.current.getConversation(config.platformUserId)];
                case 4:
                    convResponse = _a.sent();
                    setConversationId(convResponse.data.id);
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error("Error getting conversation:", error_2);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 9];
                case 7:
                    error_3 = _a.sent();
                    console.error("Error sending message:", error_3);
                    // Remove user message on error
                    setMessages(function (prev) { return prev.slice(0, -1); });
                    return [3 /*break*/, 9];
                case 8:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var handleClearConversation = function () { return __awaiter(void 0, void 0, void 0, function () {
        var convResponse, convError_1, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsClearing(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, 11, 12]);
                    if (!conversationId) return [3 /*break*/, 3];
                    return [4 /*yield*/, api.current.clearConversation(conversationId)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 3:
                    if (!(messages.length > 0 && config.platformUserId)) return [3 /*break*/, 9];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, api.current.getConversation(config.platformUserId)];
                case 5:
                    convResponse = _b.sent();
                    if (!((_a = convResponse === null || convResponse === void 0 ? void 0 : convResponse.data) === null || _a === void 0 ? void 0 : _a.id)) return [3 /*break*/, 7];
                    return [4 /*yield*/, api.current.clearConversation(convResponse.data.id)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    convError_1 = _b.sent();
                    console.log("Không có cuộc hội thoại trước đó để xóa");
                    return [3 /*break*/, 9];
                case 9:
                    // Lúc nào cũng xóa tin nhắn và reset ID cuộc hội thoại ở client
                    setMessages([]);
                    setConversationId(null);
                    return [3 /*break*/, 12];
                case 10:
                    error_4 = _b.sent();
                    console.error("Error clearing conversation:", error_4);
                    return [3 /*break*/, 12];
                case 11:
                    setIsClearing(false);
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        if (isOpen && !initialized) {
            loadMessages();
            setInitialized(true);
        }
    }, [isOpen, initialized, loadMessages]);
    (0, react_1.useEffect)(function () {
        if (messages.length > 0) {
            scrollToBottom();
            // Fix external links after messages are rendered
            externalLinkHandler();
        }
    }, [messages]);
    // State cho resize handling
    var _l = (0, react_1.useState)(false), isResizing = _l[0], setIsResizing = _l[1];
    var resizeStartPos = (0, react_1.useRef)({ x: 0, y: 0 });
    // Bắt đầu resize
    var handleResizeStart = function (e) {
        if (!config.isResizable)
            return;
        setIsResizing(true);
        resizeStartPos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };
    // Thực hiện resize
    var handleResize = (0, react_1.useCallback)(function (e) {
        if (!isResizing)
            return;
        // Tính toán delta - khoảng thay đổi của con trỏ chuột
        var deltaX = e.clientX - resizeStartPos.current.x;
        var deltaY = e.clientY - resizeStartPos.current.y;
        // Tính toán giá trị tối đa theo kích thước màn hình
        var maxWidth = window.innerWidth;
        var maxHeight = window.innerHeight;
        setChatSize(function (prev) { return ({
            // Nút resize ở góc trái trên, nên:
            // - Khi kéo sang trái (deltaX âm), width tăng
            // - Khi kéo lên trên (deltaY âm), height tăng
            // Cho phép kích thước tối đa là 100% màn hình
            width: Math.min(maxWidth, Math.max(300, prev.width + (deltaX * -1))),
            height: Math.min(maxHeight, Math.max(400, prev.height + (deltaY * -1)))
        }); });
        resizeStartPos.current = { x: e.clientX, y: e.clientY };
    }, [isResizing]);
    // Kết thúc resize
    var handleResizeEnd = (0, react_1.useCallback)(function () {
        setIsResizing(false);
    }, []);
    // Các biến không phải hooks có thể giữ nguyên vị trí
    var position = config.position || "bottom-right";
    var positionClasses = {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
    };
    // Thêm event listeners cho resize
    (0, react_1.useEffect)(function () {
        if (isResizing) {
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', handleResizeEnd);
        }
        return function () {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [isResizing, handleResize, handleResizeEnd]);
    if (!isOpen)
        return null;
    // Không hiển thị nội dung chat khi ở chế độ thu nhỏ
    if (isMinimized)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { ref: chatWidgetRef, className: "rockship-chatbox ".concat(isOpen ? "open" : "", " fixed ").concat(positionClasses[position]), style: {
            backgroundColor: ((_b = config.theme) === null || _b === void 0 ? void 0 : _b.backgroundColor) || "#ffffff",
            width: config.isResizable ? "".concat(chatSize.width, "px") : '400px',
            height: config.isResizable ? "".concat(chatSize.height, "px") : '600px',
            position: 'fixed',
            zIndex: 1000,
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
        }, children: [(0, jsx_runtime_1.jsx)(ChatHeader_1.ChatHeader, { userName: config.userName, onClose: onClose, onClear: handleClearConversation, isClearing: isClearing, theme: config.theme, supportAgentName: config.supportAgentName, headerLogo: config.headerLogo }), config.isResizable && ((0, jsx_runtime_1.jsx)("div", { className: "rockship-resize-handle", onMouseDown: handleResizeStart, style: {
                    position: 'absolute',
                    left: '2px',
                    top: '2px',
                    width: '20px',
                    height: '20px',
                    cursor: 'nw-resize',
                    zIndex: 110,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(2px)',
                    transition: isResizing ? 'none' : 'all 0.2s ease'
                }, children: (0, jsx_runtime_1.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", style: { transform: 'rotate(-45deg)' }, children: (0, jsx_runtime_1.jsx)("path", { fill: ((_c = config.theme) === null || _c === void 0 ? void 0 : _c.primaryColor) === '#007bff' ? '#ffffff' : (_d = config.theme) === null || _d === void 0 ? void 0 : _d.primaryColor, d: "M12 2V8H10V4H6V2H12ZM4 12H2V6H4V10H8V12H4Z" }) }) })), (0, jsx_runtime_1.jsxs)("div", { ref: messagesContainerRef, className: "rockship-messages-container", children: [messages.length === 0 && !isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "rockship-welcome-message", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-12 h-12 mx-auto mb-4 opacity-50", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-base", children: config.welcomeMessage || "Chào mừng bạn đến với Rockship Support!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mt-2 opacity-75", children: "H\u00E3y g\u1EEDi tin nh\u1EAFn \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u tr\u00F2 chuy\u1EC7n" })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: messages.map(function (message) { return ((0, jsx_runtime_1.jsx)(ChatMessage_1.ChatMessage, { message: message, theme: config.theme }, message.id)); }) })), isLoading && (messages.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "rockship-loading-messages", children: (0, jsx_runtime_1.jsx)("div", { className: "rockship-loading-spinner", children: (0, jsx_runtime_1.jsxs)("svg", { className: "w-8 h-8 animate-spin", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "rockship-loading rockship-typing", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u0110ang tr\u1EA3 l\u1EDDi" }), (0, jsx_runtime_1.jsxs)("div", { className: "rockship-loading-dots", children: [(0, jsx_runtime_1.jsx)("span", { className: "rockship-loading-dot" }), (0, jsx_runtime_1.jsx)("span", { className: "rockship-loading-dot" }), (0, jsx_runtime_1.jsx)("span", { className: "rockship-loading-dot" })] })] }))), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }), (0, jsx_runtime_1.jsx)(ChatInput_1.ChatInput, { onSendMessage: handleSendMessage, isLoading: isLoading, theme: config.theme })] }));
};
exports.ChatWidget = ChatWidget;
