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
            var deltaX = e.clientX - initialPos.x;
            var newTop = Math.max(16, Math.min(window.innerHeight - 80, buttonTop + deltaY));
            setButtonTop(newTop);
            // Update both X and Y positions for more natural drag movement
            setPosition({
                x: position.x + deltaX,
                y: position.y + deltaY
            });
            // Update initial position for next movement calculation
            setInitialPos({
                x: e.clientX,
                y: e.clientY
            });
        }
    };
    var handleMouseUp = function (e) {
        if (isDragging) {
            setIsDragging(false);
            // Cập nhật vị trí ban đầu sau khi kéo
            if (buttonTop !== null) {
                setInitialPos(__assign(__assign({}, initialPos), { y: buttonTop }));
            }
            // Prevent the click event from firing after drag ends
            e.stopPropagation();
            e.preventDefault();
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed z-40", style: {
            right: isMinimized ? '0' : configPosition.includes('right') ? '16px' : 'auto',
            left: configPosition.includes('left') ? '16px' : 'auto',
            top: buttonTop !== null && buttonTop !== void 0 ? buttonTop : 'auto',
            transition: 'right 0.3s ease'
        }, children: [!isOpen && ((0, jsx_runtime_1.jsx)("button", { onClick: onMinimize, className: "absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:bg-white transition-all duration-200 w-5 h-5 flex items-center justify-center z-50", title: "Thu nh\u1ECF v\u1EC1 g\u00F3c ph\u1EA3i", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })), isMinimized && isOpen && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return onMinimize(); }, className: "absolute -top-10 right-0 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-md hover:bg-white transition-all duration-200", title: "M\u1EDF r\u1ED9ng", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 15l7-7 7 7" }) }) })), (!isOpen || isMinimized) && ((0, jsx_runtime_1.jsx)("button", { ref: buttonRef, onClick: function (e) {
                    // Only trigger onClick if not dragging
                    if (!isDragging) {
                        onClick();
                    }
                }, onMouseDown: handleMouseDown, className: "rockship-floating-button ".concat(isMinimized ? 'minimized' : 'hoverable', " ").concat(isDragging ? 'dragging' : '', " ").concat(isMinimized && isOpen ? 'expanding' : ''), style: {
                    backgroundColor: ((_b = config.theme) === null || _b === void 0 ? void 0 : _b.primaryColor) || "#007bff",
                }, title: "Chat v\u1EDBi ch\u00FAng t\u00F4i", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6 text-white", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" }) }) }))] }));
};
exports.ChatButton = ChatButton;
