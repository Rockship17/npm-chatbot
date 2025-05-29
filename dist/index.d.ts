import { ChatbotConfig } from './types';
export { Chatbot } from './components/Chatbot';
export { ChatWidget } from './components/ChatWidget';
export { ChatButton } from './components/ChatButton';
export { ChatMessage } from './components/ChatMessage';
export { ChatInput } from './components/ChatInput';
export { ChatHeader } from './components/ChatHeader';
export { ChatbotAPI } from './api';
export * from './types';
export declare class CyHomeChatbotSDK {
    private container;
    private root;
    private config;
    constructor(config: ChatbotConfig);
    init(containerId?: string): void;
    updateConfig(newConfig: Partial<ChatbotConfig>): void;
    destroy(): void;
    getConfig(): ChatbotConfig;
}
export default CyHomeChatbotSDK;
declare global {
    interface Window {
        CyHomeChatbotSDK: typeof CyHomeChatbotSDK;
    }
}
