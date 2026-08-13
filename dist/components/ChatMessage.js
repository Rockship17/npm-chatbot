"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_markdown_1 = __importDefault(require("react-markdown"));
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
                    }, children: isUser ? ((0, jsx_runtime_1.jsx)("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: message.content })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-sm leading-relaxed markdown-content", children: (0, react_1.useMemo)(function () {
                            // Convert message content to a clean string
                            // This helps ensure all Vietnamese diacritical marks are preserved
                            var contentToRender = message.content;
                            // Log the exact content being rendered for debugging
                            if (contentToRender && contentToRender.includes('ạ') || contentToRender.includes('ắ') || contentToRender.includes('ế')) {
                                console.log('Rendering Vietnamese text, length:', contentToRender.length);
                            }
                            return ((0, jsx_runtime_1.jsx)(react_markdown_1.default, { components: {
                                    // Customize link rendering to open in new tab
                                    a: function (_a) {
                                        var node = _a.node, props = __rest(_a, ["node"]);
                                        return (0, jsx_runtime_1.jsx)("a", __assign({ target: "_blank", rel: "noopener noreferrer" }, props));
                                    },
                                    // Handle code blocks properly
                                    code: function (_a) {
                                        var node = _a.node, props = __rest(_a, ["node"]);
                                        return (0, jsx_runtime_1.jsx)("code", __assign({ className: "bg-gray-100 p-1 rounded" }, props));
                                    },
                                    // Ensure paragraphs preserve whitespace better
                                    p: function (_a) {
                                        var node = _a.node, props = __rest(_a, ["node"]);
                                        return (0, jsx_runtime_1.jsx)("p", __assign({ style: { whiteSpace: 'pre-wrap' } }, props));
                                    }
                                }, children: contentToRender }));
                        }, [message.content]) })) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 mt-1 ".concat(isUser ? "text-right" : "text-left"), children: formatTime(message.created_at) })] }) }));
};
exports.ChatMessage = ChatMessage;
