# Rockship Chatbot SDK

Một SDK JavaScript/TypeScript để tích hợp chatbot Rockship vào website của bạn một cách dễ dàng

## Tính năng

- 🚀 Dễ dàng tích hợp với chỉ vài dòng code
- 💬 Giao diện chat hiện đại và responsive
- 🎨 Có thể tùy chỉnh theme và vị trí
- 📱 Hỗ trợ mobile và desktop
- 🔄 Tự động load tin nhắn cũ khi scroll lên
- 🗑️ Chức năng xóa cuộc trò chuyện
- ⚡ Được viết bằng TypeScript với type safety

## Cài đặt

```bash
npm install rockship-chatbot-sdk
```

hoặc

```bash
yarn add rockship-chatbot-sdk
```

hoặc

```bash
pnpm install rockship-chatbot-sdk
```

## Sử dụng

### Tích hợp cơ bản

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rockship Chatbot Demo</title>
    <!-- Nhúng CSS của chatbot -->
    <link rel="stylesheet" href="node_modules/rockship-chatbot-sdk/dist/styles.css">
</head>
<body>
    <!-- Nội dung trang web của bạn -->
    
    <!-- Nhúng script của chatbot -->
    <script src="node_modules/rockship-chatbot-sdk/dist/index.js"></script>
    <script>
        // Khởi tạo chatbot
        const chatbot = new RockshipChatbotSDK({
            platformUserId: "YOUR_PLATFORM_USER_ID", // ID của người dùng (bắt buộc)
            userName: "YOUR_USER_NAME",     // Tên hiển thị của người dùng
            apiBaseUrl: "https://cyhome.rockship.xyz/api/v1", // URL của API
            theme: {
                primaryColor: "#007bff",     // Màu chủ đạo
                secondaryColor: "#6c757d",  // Màu phụ
                textColor: "#212529",       // Màu chữ
                backgroundColor: "#ffffff"   // Màu nền
            }
        });
        
        // Hiển thị chatbot
        chatbot.init();
    </script>
</body>
</html>
```

### Sử dụng với React

```jsx
"use client"

import React, { useEffect } from 'react';
import { RockshipChatbotSDK } from 'rockship-chatbot-sdk';
import 'rockship-chatbot-sdk/dist/styles.css';

function App() {
  useEffect(() => {
    // Khởi tạo chatbot khi component mount
    const chatbot = new RockshipChatbotSDK({
      platformUserId: "YOUR_PLATFORM_USER_ID",
      userName: "YOUR_USER_NAME",
      apiBaseUrl: "https://cyhome.rockship.xyz/api/v1",
      theme: {
        primaryColor: "#007bff",
        secondaryColor: "#6c757d",
        textColor: "#212529",
        backgroundColor: "#ffffff"
      }
    });
    
    // Hiển thị chatbot
    chatbot.init();
    
    // Clean up khi component unmount
    return () => {
      chatbot.destroy();
    };
  }, []);

  return (
    <div className="App">
      {/* Nội dung ứng dụng của bạn */}
    </div>
  );
}

export default App;
```

### Tùy chỉnh nâng cao

```javascript
const chatbot = new RockshipChatbotSDK({
  platformUserId: "YOUR_PLATFORM_USER_ID",
  userName: "YOUR_USER_NAME",
  apiBaseUrl: "https://cyhome.rockship.xyz/api/v1",
  theme: {
    primaryColor: "#007bff",
    secondaryColor: "#6c757d",
    textColor: "#212529",
    backgroundColor: "#ffffff"
  },
  position: {
    bottom: "20px",
    right: "20px"
  },
  welcomeMessage: "Xin chào! Tôi có thể giúp gì cho bạn?",
  placeholder: "Nhập tin nhắn của bạn...",
  botName: "Rockship Chatbot",
  botAvatar: "https://example.com/bot-avatar.png"
});
```

### Cách 1: Sử dụng SDK Class (Recommended)

```javascript
import RockshipChatbotSDK from 'rockship-chatbot-sdk';

// Khởi tạo chatbot
const chatbot = new RockshipChatbotSDK({
  userName: 'YOUR_USER_NAME',
  platformUserId: 'YOUR_PLATFORM_USER_ID',
  apiBaseUrl: 'https://cyhome.rockship.xyz/api/v1', // optional
  position: 'bottom-right', // optional
  theme: {
    primaryColor: '#007bff',
    backgroundColor: '#f8f9fa',
    textColor: '#333'
  },
  welcomeMessage: 'Chào mừng bạn đến với Rockship Support!'
});

// Khởi tạo chatbot
chatbot.init();

// Hoặc khởi tạo trong một container cụ thể
chatbot.init('my-chatbot-container');
```

### Cách 2: Sử dụng React Component trực tiếp

```jsx
import React from 'react';
import { Chatbot } from 'rockship-chatbot-sdk';

function App() {
  const config = {
    userName: 'YOUR_USER_NAME',
    platformUserId: 'YOUR_PLATFORM_USER_ID',
    position: 'bottom-right',
    theme: {
      primaryColor: '#007bff',
      backgroundColor: '#f8f9fa',
      textColor: '#333'
    }
  };

  return (
    <div>
      <h1>My Website</h1>
      <Chatbot config={config} />
    </div>
  );
}
```

### Cách 3: Sử dụng qua CDN (Browser)

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/rockship-chatbot-sdk/dist/index.js"></script>
</head>
<body>
    <div id="root">
        <h1>My Website</h1>
    </div>

    <script>
        // Khởi tạo chatbot
        const chatbot = new window.RockshipChatbotSDK({
            userName: 'YOUR_USER_NAME',
            platformUserId: 'YOUR_PLATFORM_USER_ID',
            position: 'bottom-right',
            theme: {
                primaryColor: '#007bff',
                backgroundColor: '#f8f9fa',
                textColor: '#333'
            }
        });

        chatbot.init();
    </script>
</body>
</html>
```

## Cấu hình

### ChatbotConfig

```typescript
interface ChatbotConfig {
  userName: string;                    // Tên người dùng (bắt buộc)
  platformUserId: string;              // ID người dùng trên platform (bắt buộc)
  apiBaseUrl?: string;                 // URL API base (mặc định: https://cyhome.rockship.xyz/api/v1)
  theme?: {                            // Tùy chỉnh theme
    primaryColor?: string;             // Màu chính (mặc định: #007bff)
    backgroundColor?: string;          // Màu nền (mặc định: #f8f9fa)
    textColor?: string;               // Màu chữ (mặc định: #333)
  };
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'; // Vị trí (mặc định: bottom-right)
  welcomeMessage?: string;            // Tin nhắn chào mừng
}
```

## API Methods (SDK Class)

### `init(containerId?: string)`

Khởi tạo chatbot. Nếu không truyền `containerId`, chatbot sẽ được thêm vào body.

### `updateConfig(newConfig: Partial<ChatbotConfig>)`

Cập nhật cấu hình chatbot.

```javascript
chatbot.updateConfig({
  theme: {
    primaryColor: '#28a745'
  }
});
```

### `destroy()`

Hủy chatbot và cleanup resources.

```javascript
chatbot.destroy();
```

### `getConfig()`

Lấy cấu hình hiện tại.

```javascript
const currentConfig = chatbot.getConfig();
```

## Ví dụ nâng cao

### Tùy chỉnh theme dark mode

```javascript
const darkThemeChatbot = new RockshipChatbotSDK({
  userName: 'User',
  platformUserId: 'user123',
  theme: {
    primaryColor: '#6366f1',
    backgroundColor: '#1f2937',
    textColor: '#f9fafb'
  },
  position: 'bottom-left'
});

darkThemeChatbot.init();
```

### Sử dụng với framework khác (Vue.js)

```vue
<template>
  <div>
    <h1>My Vue App</h1>
    <div id="chatbot-container"></div>
  </div>
</template>

<script>
import CyHomeChatbotSDK from 'cyhome-chatbot-sdk';

export default {
  name: 'App',
  mounted() {
    this.chatbot = new RockshipChatbotSDK({
      userName: 'Vue User',
      platformUserId: 'vue-user-123'
    });
    
    this.chatbot.init('chatbot-container');
  },
  beforeUnmount() {
    if (this.chatbot) {
      this.chatbot.destroy();
    }
  }
}
</script>
```

## API Endpoints sử dụng

SDK sử dụng các API endpoints sau:

- `GET /api/v1/message/:platform_user_id` - Lấy danh sách tin nhắn
- `POST /api/v1/cyhome/invoke` - Gửi tin nhắn mới (API endpoint giữ nguyên)
- `GET /api/v1/conversation/:platform_user_id` - Lấy thông tin conversation
- `DELETE /api/v1/conversation/:conversation_id` - Xóa conversation

## Development

### Build từ source

```bash
# Clone repository
git clone <repository-url>
cd rockship-chatbot-sdk

# Cài đặt dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

### Publish to NPM

```bash
# Build trước khi publish
npm run build

# Login to NPM
npm login

# Publish
npm publish
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## Support

Nếu bạn gặp vấn đề, vui lòng tạo issue trên GitHub repository.
