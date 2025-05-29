"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatbot = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var ChatButton_1 = require("./ChatButton");
var ChatWidget_1 = require("./ChatWidget");
var Chatbot = function (_a) {
    var config = _a.config;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_1.useState)(false), isMinimized = _c[0], setIsMinimized = _c[1];
    // Inject styles when component mounts
    (0, react_1.useEffect)(function () {
        var styleId = "cyhome-chatbot-styles";
        if (!document.getElementById(styleId)) {
            var style = document.createElement("style");
            style.id = styleId;
            style.textContent = "\n        @keyframes spin {\n          to {\n            transform: rotate(360deg);\n          }\n        }\n        .animate-spin {\n          animation: spin 1s linear infinite;\n        }\n        .transition-all {\n          transition-property: all;\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-duration: 150ms;\n        }\n        .transition-colors {\n          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-duration: 150ms;\n        }\n        .duration-300 {\n          transition-duration: 300ms;\n        }\n        .hover\\:scale-110:hover {\n          transform: scale(1.1);\n        }\n        .hover\\:shadow-xl:hover {\n          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n        }\n        .shadow-lg {\n          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n        }\n        .shadow-2xl {\n          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);\n        }\n        .focus\\:outline-none:focus {\n          outline: 2px solid transparent;\n          outline-offset: 2px;\n        }\n        .focus\\:ring-2:focus {\n          box-shadow: 0 0 0 2px var(--ring-color, rgb(59 130 246 / 0.5));\n        }\n        .focus\\:ring-opacity-50:focus {\n          --ring-opacity: 0.5;\n        }\n      ";
            document.head.appendChild(style);
        }
    }, []);
    var toggleChat = function () {
        if (isMinimized) {
            // Nếu đang ở trạng thái thu nhỏ, click vào button sẽ mở rộng lại
            setIsMinimized(false);
        }
        else {
            // Nếu không ở trạng thái thu nhỏ, sẽ toggle mở/đóng chat
            setIsOpen(!isOpen);
        }
    };
    var closeChat = function () {
        setIsOpen(false);
        setIsMinimized(false);
    };
    var minimizeChat = function () {
        setIsMinimized(true);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "cyhome-chatbot-container ".concat(isMinimized ? 'minimized' : ''), children: [(0, jsx_runtime_1.jsx)(ChatButton_1.ChatButton, { onClick: toggleChat, isOpen: isOpen, isMinimized: isMinimized, onMinimize: minimizeChat, config: config }), (0, jsx_runtime_1.jsx)(ChatWidget_1.ChatWidget, { config: config, isOpen: isOpen, isMinimized: isMinimized, onClose: closeChat, onMinimize: minimizeChat })] }));
};
exports.Chatbot = Chatbot;
