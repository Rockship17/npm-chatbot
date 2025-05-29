import React from "react";
import { ChatbotConfig } from "../types";
interface ChatWidgetProps {
    config: ChatbotConfig;
    isOpen: boolean;
    isMinimized: boolean;
    onClose: () => void;
    onMinimize: () => void;
}
export declare const ChatWidget: React.FC<ChatWidgetProps>;
export {};
