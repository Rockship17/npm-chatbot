// Supported languages
export type Language = 'en' | 'vi';

// Translation keys for all text that needs to be translated
export interface Translations {
  // Input component
  enterMessage: string;
  
  // Header component
  hello: string;
  chatHistory: string;
  minimize: string;
  maximize: string;
  
  // Widget component
  welcomeMessage: string;
  defaultGreeting: string;
  loadMore: string;
  noMessages: string;
  clearConversation: string;
  backToChat: string;
  conversationHistory: string;
  noConversations: string;
}

// English translations
const en: Translations = {
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
  noMessages: "No messages yet",
  clearConversation: "Clear conversation",
  backToChat: "Back to chat",
  conversationHistory: "Conversation history",
  noConversations: "No previous conversations",
};

// Vietnamese translations
const vi: Translations = {
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
  noMessages: "Chưa có tin nhắn",
  clearConversation: "Xóa cuộc trò chuyện",
  backToChat: "Quay lại trò chuyện",
  conversationHistory: "Lịch sử trò chuyện",
  noConversations: "Không có cuộc trò chuyện trước đó",
};

// Map of all translations
const translations: Record<Language, Translations> = {
  en,
  vi,
};

// Function to get translations based on language
export const getTranslations = (language: Language = 'en'): Translations => {
  return translations[language] || translations.en;
};
