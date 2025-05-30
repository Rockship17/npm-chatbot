"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatButton = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var ChatButton = function (_a) {
    var _b, _c, _d, _e, _f;
    var onClick = _a.onClick, isOpen = _a.isOpen, isMinimized = _a.isMinimized, onMinimize = _a.onMinimize, config = _a.config;
    // Không sử dụng isMinimized và onMinimize nữa, nhưng vẫn giữ trong props để tránh breaking changes
    var _g = (0, react_1.useState)(false), isDragging = _g[0], setIsDragging = _g[1];
    var _h = (0, react_1.useState)(false), justDragged = _h[0], setJustDragged = _h[1]; // Thêm biến để theo dõi button vừa được kéo thả
    var _j = (0, react_1.useState)(function () {
        var _a, _b, _c, _d;
        // Initialize position from config if provided, otherwise default values
        return {
            x: ((_b = (_a = config.buttonConfig) === null || _a === void 0 ? void 0 : _a.position) === null || _b === void 0 ? void 0 : _b.x) || 0,
            y: ((_d = (_c = config.buttonConfig) === null || _c === void 0 ? void 0 : _c.position) === null || _d === void 0 ? void 0 : _d.y) || 0,
        };
    }), position = _j[0], setPosition = _j[1];
    var _k = (0, react_1.useState)({ x: 0, y: 0 }), initialPos = _k[0], setInitialPos = _k[1];
    var buttonRef = (0, react_1.useRef)(null);
    var dragStartTime = (0, react_1.useRef)(0); // Thêm ref để theo dõi thời điểm bắt đầu kéo
    var configPosition = config.position || "bottom-right";
    // Handle initial positioning and update when config changes
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d;
        if (buttonRef.current) {
            // Apply custom position from config if available
            if (((_b = (_a = config.buttonConfig) === null || _a === void 0 ? void 0 : _a.position) === null || _b === void 0 ? void 0 : _b.x) !== undefined && ((_d = (_c = config.buttonConfig) === null || _c === void 0 ? void 0 : _c.position) === null || _d === void 0 ? void 0 : _d.y) !== undefined) {
                setPosition({
                    x: config.buttonConfig.position.x,
                    y: config.buttonConfig.position.y,
                });
            }
            else {
                // Default positioning based on configPosition if no custom position is set
                var rect = buttonRef.current.getBoundingClientRect();
                var posX = 0;
                var posY = 0;
                if (configPosition.includes("right")) {
                    posX = window.innerWidth - rect.width - 16;
                }
                else if (configPosition.includes("left")) {
                    posX = 16;
                }
                if (configPosition.includes("top")) {
                    posY = 16;
                }
                else if (configPosition.includes("bottom")) {
                    posY = window.innerHeight - rect.height - 16;
                }
                setPosition({ x: posX, y: posY });
            }
        }
    }, [configPosition, (_b = config.buttonConfig) === null || _b === void 0 ? void 0 : _b.position]);
    // Handle dragging start
    var handleMouseDown = function (e) {
        if (isOpen)
            return; // Don't allow dragging when chat is open
        setIsDragging(true);
        setInitialPos({
            x: e.clientX,
            y: e.clientY,
        });
        // Lưu thời điểm bắt đầu kéo
        dragStartTime.current = Date.now();
        // Prevent default to avoid text selection during drag
        e.preventDefault();
    };
    // Handle dragging movement - now supports both X and Y directions
    var handleMouseMove = function (e) {
        var _a, _b;
        if (isDragging) {
            var deltaX = e.clientX - initialPos.x;
            var deltaY = e.clientY - initialPos.y;
            // Calculate new position with boundaries
            var newX = Math.max(0, Math.min(window.innerWidth - (((_a = buttonRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) || 60), position.x + deltaX));
            var newY = Math.max(0, Math.min(window.innerHeight - (((_b = buttonRef.current) === null || _b === void 0 ? void 0 : _b.offsetHeight) || 60), position.y + deltaY));
            // Update position
            setPosition({ x: newX, y: newY });
            // Update initial position for next movement calculation
            setInitialPos({
                x: e.clientX,
                y: e.clientY,
            });
        }
    };
    // Handle dragging end
    var handleMouseUp = function (e) {
        if (isDragging) {
            setIsDragging(false);
            var dragDuration = Date.now() - dragStartTime.current;
            // Chỉ ngăn chặn sự kiện click khi kéo trong khoảng thời gian ngắn (100ms)
            // Đây là trường hợp người dùng có ý định click chứ không phải kéo
            if (dragDuration < 100) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            // Đánh dấu rằng button vừa được kéo thả
            setJustDragged(true);
            // Reset trạng thái justDragged sau 500ms để cho phép click lại
            setTimeout(function () {
                setJustDragged(false);
            }, 500);
            // Không tự động mở box chat sau khi kéo thả nữa
            // Người dùng sẽ cần click vào button để mở box chat
        }
    };
    // Register/unregister event listeners
    (0, react_1.useEffect)(function () {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
        return function () {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, initialPos, position]);
    // Calculate button size with default fallback
    var buttonSize = ((_c = config.buttonConfig) === null || _c === void 0 ? void 0 : _c.size) || 60;
    // Define custom button shadow or use enhanced default shadow
    var buttonShadow = ((_d = config.buttonConfig) === null || _d === void 0 ? void 0 : _d.shadow) || "0 8px 25px rgba(102, 126, 234, 0.6)";
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed z-40", style: {
            left: position.x + "px",
            top: position.y + "px",
            transition: isDragging ? "none" : "all 0.3s ease",
        }, children: !isOpen && ((0, jsx_runtime_1.jsx)("button", { ref: buttonRef, onClick: function (e) {
                // Chỉ kích hoạt onClick nếu không đang kéo và không phải vừa kéo xong
                if (!isDragging && !justDragged) {
                    onClick();
                }
            }, onMouseDown: handleMouseDown, className: "rockship-floating-button group hoverable ".concat(isDragging ? "dragging" : ""), style: {
                backgroundColor: ((_e = config.theme) === null || _e === void 0 ? void 0 : _e.primaryColor) || "#007bff",
                boxShadow: buttonShadow,
                width: buttonSize + "px",
                height: buttonSize + "px",
                // Add a pulsing effect to make the button more noticeable
                animation: !isOpen && !isMinimized ? "pulse 2s infinite" : "none",
            }, children: ((_f = config.buttonConfig) === null || _f === void 0 ? void 0 : _f.logo) ? ((0, jsx_runtime_1.jsx)("div", { className: "w-2/3 h-2/3 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("img", { src: config.buttonConfig.logo, className: "w-4/5 h-4/5 object-cover" }) })) : ((0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6 text-white", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" }) })) })) }));
};
exports.ChatButton = ChatButton;
