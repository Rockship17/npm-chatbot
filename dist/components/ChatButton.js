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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatButton = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var ChatButton = function (_a) {
    var _b;
    var onClick = _a.onClick, isOpen = _a.isOpen, isMinimized = _a.isMinimized, onMinimize = _a.onMinimize, config = _a.config;
    var _c = (0, react_1.useState)(false), isDragging = _c[0], setIsDragging = _c[1];
    var _d = (0, react_1.useState)({ x: 0, y: 0 }), position = _d[0], setPosition = _d[1];
    var _e = (0, react_1.useState)({ x: 0, y: 0 }), initialPos = _e[0], setInitialPos = _e[1];
    var _f = (0, react_1.useState)(null), buttonTop = _f[0], setButtonTop = _f[1];
    var buttonRef = (0, react_1.useRef)(null);
    var configPosition = config.position || "bottom-right";
    // Khởi tạo vị trí ban đầu dựa trên config
    (0, react_1.useEffect)(function () {
        if (buttonRef.current) {
            var rect = buttonRef.current.getBoundingClientRect();
            var initialTop = configPosition.includes('top')
                ? 16 // top-left or top-right
                : window.innerHeight - rect.height - 16; // bottom-left or bottom-right
            setButtonTop(initialTop);
        }
    }, [configPosition]);
    // Xử lý sự kiện chuột/chạm cho tính năng kéo thả
    var handleMouseDown = function (e) {
        if (isOpen)
            return; // Không cho phép kéo khi chat đang mở
        setIsDragging(true);
        setInitialPos({
            x: e.clientX,
            y: e.clientY
        });
    };
    var handleMouseMove = function (e) {
        if (isDragging && buttonTop !== null) {
            var deltaY = e.clientY - initialPos.y;
            var newTop = Math.max(16, Math.min(window.innerHeight - 80, buttonTop + deltaY));
            setButtonTop(newTop);
            setPosition(__assign(__assign({}, position), { y: deltaY }));
        }
    };
    var handleMouseUp = function () {
        if (isDragging) {
            setIsDragging(false);
            // Cập nhật vị trí ban đầu sau khi kéo
            if (buttonTop !== null) {
                setInitialPos(__assign(__assign({}, initialPos), { y: buttonTop }));
            }
        }
    };
    // Đăng ký/hủy đăng ký sự kiện
    (0, react_1.useEffect)(function () {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return function () {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, initialPos, buttonTop]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed z-40", style: { right: configPosition.includes('right') ? '16px' : 'auto', left: configPosition.includes('left') ? '16px' : 'auto', top: buttonTop !== null && buttonTop !== void 0 ? buttonTop : 'auto' }, children: [isOpen && !isMinimized && ((0, jsx_runtime_1.jsx)("button", { onClick: onMinimize, className: "absolute -top-10 right-0 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-md hover:bg-white transition-all duration-200", title: "Thu nh\u1ECF", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })), (0, jsx_runtime_1.jsx)("button", { ref: buttonRef, onClick: onClick, onMouseDown: handleMouseDown, className: "cyhome-floating-button ".concat(isMinimized ? 'minimized' : isOpen ? '' : 'hoverable', " ").concat(isDragging ? 'dragging' : '', " ").concat(isOpen && !isMinimized ? 'rotate-45' : '', " ").concat(isMinimized && isOpen ? 'expanding' : ''), style: {
                    backgroundColor: ((_b = config.theme) === null || _b === void 0 ? void 0 : _b.primaryColor) || "#007bff",
                }, title: "Chat v\u1EDBi ch\u00FAng t\u00F4i", children: isOpen ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6 text-white", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }) })) : ((0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6 text-white", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" }) })) })] }));
};
exports.ChatButton = ChatButton;
