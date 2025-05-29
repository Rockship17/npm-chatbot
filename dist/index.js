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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RockshipChatbotSDK = exports.ChatbotAPI = exports.ChatHeader = exports.ChatInput = exports.ChatMessage = exports.ChatButton = exports.ChatWidget = exports.Chatbot = void 0;
var react_1 = __importDefault(require("react"));
var client_1 = __importDefault(require("react-dom/client"));
var Chatbot_1 = require("./components/Chatbot");
// Named exports
var Chatbot_2 = require("./components/Chatbot");
Object.defineProperty(exports, "Chatbot", { enumerable: true, get: function () { return Chatbot_2.Chatbot; } });
var ChatWidget_1 = require("./components/ChatWidget");
Object.defineProperty(exports, "ChatWidget", { enumerable: true, get: function () { return ChatWidget_1.ChatWidget; } });
var ChatButton_1 = require("./components/ChatButton");
Object.defineProperty(exports, "ChatButton", { enumerable: true, get: function () { return ChatButton_1.ChatButton; } });
var ChatMessage_1 = require("./components/ChatMessage");
Object.defineProperty(exports, "ChatMessage", { enumerable: true, get: function () { return ChatMessage_1.ChatMessage; } });
var ChatInput_1 = require("./components/ChatInput");
Object.defineProperty(exports, "ChatInput", { enumerable: true, get: function () { return ChatInput_1.ChatInput; } });
var ChatHeader_1 = require("./components/ChatHeader");
Object.defineProperty(exports, "ChatHeader", { enumerable: true, get: function () { return ChatHeader_1.ChatHeader; } });
var api_1 = require("./api");
Object.defineProperty(exports, "ChatbotAPI", { enumerable: true, get: function () { return api_1.ChatbotAPI; } });
__exportStar(require("./types"), exports);
// Main SDK class
var RockshipChatbotSDK = /** @class */ (function () {
    function RockshipChatbotSDK(config) {
        this.container = null;
        this.root = null;
        this.config = __assign({ apiBaseUrl: 'https://cyhome.rockship.xyz/api/v1', position: 'bottom-right', theme: {
                primaryColor: '#007bff',
                backgroundColor: '#f8f9fa',
                textColor: '#333'
            }, welcomeMessage: 'Chào mừng bạn đến với Rockship Support!' }, config);
    }
    // Initialize the chatbot
    RockshipChatbotSDK.prototype.init = function (containerId) {
        try {
            // Create container if not provided
            if (containerId) {
                this.container = document.getElementById(containerId);
                if (!this.container) {
                    throw new Error("Container with id \"".concat(containerId, "\" not found"));
                }
            }
            else {
                this.container = document.createElement('div');
                this.container.id = 'rockship-chatbot-container';
                document.body.appendChild(this.container);
            }
            // Create React root and render
            if (client_1.default.createRoot) {
                this.root = client_1.default.createRoot(this.container);
                this.root.render(react_1.default.createElement(Chatbot_1.Chatbot, { config: this.config }));
            }
            else {
                // Fallback for older React versions
                client_1.default.render(react_1.default.createElement(Chatbot_1.Chatbot, { config: this.config }), this.container);
            }
        }
        catch (error) {
            console.error('Rockship Chatbot SDK initialization failed:', error);
        }
    };
    // Update configuration
    RockshipChatbotSDK.prototype.updateConfig = function (newConfig) {
        this.config = __assign(__assign({}, this.config), newConfig);
        if (this.root && this.container) {
            this.root.render(react_1.default.createElement(Chatbot_1.Chatbot, { config: this.config }));
        }
    };
    // Destroy the chatbot
    RockshipChatbotSDK.prototype.destroy = function () {
        // In React 18, we use root.unmount() instead of ReactDOM.unmountComponentAtNode
        if (this.root) {
            this.root.unmount();
        }
        if (this.container && this.container.id === 'rockship-chatbot-container') {
            document.body.removeChild(this.container);
        }
        this.container = null;
        this.root = null;
    };
    // Get current configuration
    RockshipChatbotSDK.prototype.getConfig = function () {
        return __assign({}, this.config);
    };
    return RockshipChatbotSDK;
}());
exports.RockshipChatbotSDK = RockshipChatbotSDK;
// Default export
exports.default = RockshipChatbotSDK;
// Auto-attach to window if in browser environment
if (typeof window !== 'undefined') {
    window.RockshipChatbotSDK = RockshipChatbotSDK;
}
