"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranslations = void 0;
// English translations
var en = {
    // Input component
    enterMessage: "Enter your message...",
    // Header component
    hello: "Hello",
    chatHistory: "Chat history",
    minimize: "Minimize",
    maximize: "Maximize",
    // Widget component
    welcomeMessage: "Welcome to Rockship Support!",
    defaultGreeting: "Hello! How can I help you?",
    loadMore: "Load more",
    typingLabel: "Typing",
    noMessages: "No messages yet",
    clearConversation: "Clear conversation",
    backToChat: "New chat",
    conversationHistory: "Conversation history",
    noConversations: "No previous conversations",
};
// Vietnamese translations
var vi = {
    // Input component
    enterMessage: "Nhập tin nhắn của bạn...",
    // Header component
    hello: "Xin chào",
    chatHistory: "Lịch sử trò chuyện",
    minimize: "Thu nhỏ",
    maximize: "Phóng to",
    // Widget component
    welcomeMessage: "Chào mừng bạn đến với Rockship Support!",
    defaultGreeting: "Xin chào! Tôi có thể giúp gì cho bạn?",
    loadMore: "Tải thêm",
    typingLabel: "Đang nhập",
    noMessages: "Chưa có tin nhắn",
    clearConversation: "Xóa cuộc trò chuyện",
    backToChat: "Cuộc trò chuyện mới",
    conversationHistory: "Lịch sử trò chuyện",
    noConversations: "Không có cuộc trò chuyện trước đó",
};
// Map of all translations
var translations = {
    en: en,
    vi: vi,
};
// Function to get translations based on language
var getTranslations = function (language) {
    if (language === void 0) { language = 'en'; }
    return translations[language] || translations.en;
};
exports.getTranslations = getTranslations;
