import React from "react";
import { ChatbotConfig } from "../types";
interface ChatButtonProps {
    onClick: () => void;
    isOpen: boolean;
    config: ChatbotConfig;
}
export declare const ChatButton: React.FC<ChatButtonProps>;
export {};
