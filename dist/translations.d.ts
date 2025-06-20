export type Language = 'en' | 'vi';
export interface Translations {
    enterMessage: string;
    hello: string;
    chatHistory: string;
    minimize: string;
    maximize: string;
    welcomeMessage: string;
    defaultGreeting: string;
    loadMore: string;
    typingLabel: string;
    noMessages: string;
    clearConversation: string;
    backToChat: string;
    conversationHistory: string;
    noConversations: string;
    errorMessage: string;
}
export declare const getTranslations: (language?: Language) => Translations;
