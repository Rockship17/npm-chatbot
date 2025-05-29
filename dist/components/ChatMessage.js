"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var ChatMessage = function (_a) {
    var message = _a.message, theme = _a.theme;
    var isUser = message.type === "user";
    var formatTime = function (dateString) {
        return new Date(dateString).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "mb-4 flex ".concat(isUser ? "justify-end" : "justify-start"), children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-[80%] ".concat(isUser ? "order-2" : "order-1"), children: [(0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 rounded-lg break-words ".concat(isUser ? "rounded-br-none text-white" : "rounded-bl-none border"), style: {
                        backgroundColor: isUser ? (theme === null || theme === void 0 ? void 0 : theme.primaryColor) || "#007bff" : (theme === null || theme === void 0 ? void 0 : theme.backgroundColor) || "#f8f9fa",
                        color: isUser ? "white" : (theme === null || theme === void 0 ? void 0 : theme.textColor) || "#333",
                        borderColor: !isUser ? "#e9ecef" : "transparent",
                    }, children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: message.content }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 mt-1 ".concat(isUser ? "text-right" : "text-left"), children: formatTime(message.created_at) })] }) }));
};
exports.ChatMessage = ChatMessage;
