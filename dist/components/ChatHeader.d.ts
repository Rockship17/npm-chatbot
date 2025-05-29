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
}
export declare const ChatHeader: React.FC<ChatHeaderProps>;
export {};
