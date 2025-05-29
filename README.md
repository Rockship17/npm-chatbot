# Rockship Chatbot SDK v1.1.0

Một SDK JavaScript/TypeScript để tích hợp chatbot Rockship vào website của bạn một cách dễ dàng với API mới nhất

## Tính năng

- 🚀 Dễ dàng tích hợp với chỉ vài dòng code
- 🎨 Có thể tùy chỉnh theme và vị trí
- 🗑️ Chức năng xóa cuộc trò chuyện
- ⚡ Được viết bằng TypeScript

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
            apiToken: "YOUR_API_TOKEN",     // Token xác thực (bắt buộc)
            apiBaseUrl: "https://bot.rockship.xyz/api/v1", // URL của API
            theme: {
                primaryColor: "#007bff",     // Màu chủ đạo
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
      apiToken: "YOUR_API_TOKEN",
      apiBaseUrl: "https://bot.rockship.xyz/api/v1",
      theme: {
        primaryColor: "#007bff",
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

### Cách 1: Sử dụng SDK Class (Recommended)

```javascript
import RockshipChatbotSDK from 'rockship-chatbot-sdk';

// Khởi tạo chatbot
const chatbot = new RockshipChatbotSDK({
  userName: 'YOUR_USER_NAME',
  platformUserId: 'YOUR_PLATFORM_USER_ID',
  apiToken: 'YOUR_API_TOKEN', // required for authentication
  apiBaseUrl: 'https://bot.rockship.xyz/api/v1', // optional
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
    apiToken: 'YOUR_API_TOKEN',
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
            apiToken: 'YOUR_API_TOKEN',
            apiBaseUrl: 'https://bot.rockship.xyz/api/v1',
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
}
```

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

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT

## Support

Nếu bạn gặp vấn đề, vui lòng tạo issue trên GitHub repository.
