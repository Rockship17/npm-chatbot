import React from "react";
import { Language } from "../translations";
interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    theme?: {
        primaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
    };
    language?: Language;
}
export declare const ChatInput: React.FC<ChatInputProps>;
export {};
