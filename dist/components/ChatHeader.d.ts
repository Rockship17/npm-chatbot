import React from "react";
import { Language } from "../translations";
interface ChatHeaderProps {
    userName: string;
    onClose: () => void;
    onClear: () => void;
    onShowHistory: () => void;
    isClearing: boolean;
    theme?: {
        primaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
    };
    supportAgentName?: string;
    headerLogo?: string;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    language?: Language;
}
export declare const ChatHeader: React.FC<ChatHeaderProps>;
export {};
