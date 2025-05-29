"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatInput = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var ChatInput = function (_a) {
    var _b;
    var onSendMessage = _a.onSendMessage, isLoading = _a.isLoading, theme = _a.theme;
    var _c = (0, react_1.useState)(""), message = _c[0], setMessage = _c[1];
    var textareaRef = (0, react_1.useRef)(null);
    // Auto-resize textarea based on content
    (0, react_1.useEffect)(function () {
        var textarea = textareaRef.current;
        if (textarea) {
            // Reset height to get the correct scrollHeight
            textarea.style.height = 'auto';
            // Set the height to the scrollHeight
            var newHeight = Math.min(textarea.scrollHeight, 120); // Max height of 120px
            textarea.style.height = "".concat(newHeight, "px");
        }
    }, [message]);
    var handleSend = function () {
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };
    var handleKeyPress = function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "border-t bg-white p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-end gap-2", children: [(0, jsx_runtime_1.jsx)("textarea", { ref: textareaRef, value: message, onChange: function (e) { return setMessage(e.target.value); }, onKeyPress: handleKeyPress, placeholder: "Nh\u1EADp tin nh\u1EAFn c\u1EE7a b\u1EA1n...", style: {
                        borderColor: "#e9ecef",
                        minHeight: "40px",
                        maxHeight: "120px",
                        overflowY: "auto"
                    }, 
                    // Custom className with focus ring color based on theme
                    className: "flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-".concat(((_b = theme === null || theme === void 0 ? void 0 : theme.primaryColor) === null || _b === void 0 ? void 0 : _b.replace("#", "")) || "007bff"), rows: 1, disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSend, disabled: !message.trim() || isLoading, className: "px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed", style: {
                        backgroundColor: (theme === null || theme === void 0 ? void 0 : theme.primaryColor) || "#007bff",
                    }, children: isLoading ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 animate-spin", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsxs)("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeDasharray: "32", strokeDashoffset: "32", children: [(0, jsx_runtime_1.jsx)("animate", { attributeName: "stroke-dasharray", dur: "2s", values: "0 32;16 16;0 32;0 32", repeatCount: "indefinite" }), (0, jsx_runtime_1.jsx)("animate", { attributeName: "stroke-dashoffset", dur: "2s", values: "0;-16;-32;-32", repeatCount: "indefinite" })] }) })) : ((0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M2 21l21-9L2 3v7l15 2-15 2v7z" }) })) })] }) }));
};
exports.ChatInput = ChatInput;
