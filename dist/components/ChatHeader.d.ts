import React from "react";
interface ChatHeaderProps {
    userName: string;
    onClose: () => void;
    onClear: () => void;
    isClearing: boolean;
    theme?: {
        primaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
    };
    supportAgentName?: string;
    headerLogo?: string;
}
export declare const ChatHeader: React.FC<ChatHeaderProps>;
export {};
