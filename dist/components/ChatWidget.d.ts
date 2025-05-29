import React from "react";
import { ChatbotConfig } from "../types";
interface ChatWidgetProps {
    config: ChatbotConfig;
    isOpen: boolean;
    onClose: () => void;
}
export declare const ChatWidget: React.FC<ChatWidgetProps>;
export {};
