import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chatbot } from './components/Chatbot';
import { ChatbotConfig } from './types';

// Named exports
export { Chatbot } from './components/Chatbot';
export { ChatWidget } from './components/ChatWidget';
export { ChatButton } from './components/ChatButton';
export { ChatMessage } from './components/ChatMessage';
export { ChatInput } from './components/ChatInput';
export { ChatHeader } from './components/ChatHeader';
export { ChatbotAPI } from './api';
export * from './types';

// Main SDK class
export class CyHomeChatbotSDK {
    private container: HTMLElement | null = null;
    private root: any = null;
    private config: ChatbotConfig;

    constructor(config: ChatbotConfig) {
        this.config = {
            apiBaseUrl: 'https://cyhome.rockship.xyz/api/v1',
            position: 'bottom-right',
            theme: {
                primaryColor: '#007bff',
                backgroundColor: '#f8f9fa',
                textColor: '#333'
            },
            welcomeMessage: 'Chào mừng bạn đến với CyHome Support!',
            ...config
        };
    }

    // Initialize the chatbot
    init(containerId?: string): void {
        try {
            // Create container if not provided
            if (containerId) {
                this.container = document.getElementById(containerId);
                if (!this.container) {
                    throw new Error(`Container with id "${containerId}" not found`);
                }
            } else {
                this.container = document.createElement('div');
                this.container.id = 'cyhome-chatbot-container';
                document.body.appendChild(this.container);
            }

            // Create React root and render
            if (ReactDOM.createRoot) {
                this.root = ReactDOM.createRoot(this.container);
                this.root.render(React.createElement(Chatbot, { config: this.config }));
            } else {
                // Fallback for older React versions
                (ReactDOM as any).render(
                    React.createElement(Chatbot, { config: this.config }),
                    this.container
                );
            }
        } catch (error) {
            console.error('CyHome Chatbot SDK initialization failed:', error);
        }
    }

    // Update configuration
    updateConfig(newConfig: Partial<ChatbotConfig>): void {
        this.config = { ...this.config, ...newConfig };
        if (this.root && this.container) {
            this.root.render(React.createElement(Chatbot, { config: this.config }));
        }
    }

    // Destroy the chatbot
    destroy(): void {
        // In React 18, we use root.unmount() instead of ReactDOM.unmountComponentAtNode
        if (this.root) {
            this.root.unmount();
        }

        if (this.container && this.container.id === 'cyhome-chatbot-container') {
            document.body.removeChild(this.container);
        }

        this.container = null;
        this.root = null;
    }

    // Get current configuration
    getConfig(): ChatbotConfig {
        return { ...this.config };
    }
}

// Default export
export default CyHomeChatbotSDK;

// Global window object for browser usage
declare global {
    interface Window {
        CyHomeChatbotSDK: typeof CyHomeChatbotSDK;
    }
}

// Auto-attach to window if in browser environment
if (typeof window !== 'undefined') {
    window.CyHomeChatbotSDK = CyHomeChatbotSDK;
}