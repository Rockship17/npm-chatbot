import React from "react";
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
}
export declare const ChatHeader: React.FC<ChatHeaderProps>;
export {};
