import React from "react";
import { ChatbotConfig } from "../types";
interface ChatButtonProps {
    onClick: () => void;
    isOpen: boolean;
    isMinimized: boolean;
    onMinimize: () => void;
    config: ChatbotConfig;
}
export declare const ChatButton: React.FC<ChatButtonProps>;
export {};
