import React from "react";
import { Message } from "../types";
interface ChatMessageProps {
    message: Message;
    theme?: {
        primaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
    };
}
export declare const ChatMessage: React.FC<ChatMessageProps>;
export {};
