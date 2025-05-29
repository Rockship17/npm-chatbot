import React from "react";
interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    theme?: {
        primaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
    };
}
export declare const ChatInput: React.FC<ChatInputProps>;
export {};
