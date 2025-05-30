# Rockship Chatbot SDK v1.3.6

Một SDK JavaScript/TypeScript để tích hợp chatbot Rockship vào website của bạn một cách dễ dàng với API mới nhất

## Tính năng

- 🚀 Dễ dàng tích hợp với chỉ vài dòng code
- 🎨 Tùy chỉnh hoàn toàn giao diện (logo, màu sắc, kích thước, vị trí)
- 🔄 Hỗ trợ kéo thả nút chat đến bất kỳ vị trí nào trên màn hình
- 📏 Có thể điều chỉnh kích thước hộp chat theo nhu cầu
- 🔗 Liên kết mở trong tab mới
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
            },
            // Cấu hình mới
            supportAgentName: "Hỗ trợ của Tôi", // Tên hiển thị của agent hỗ trợ
            headerLogo: "https://example.com/logo.png", // Logo hiển thị trong header
            isResizable: true,  // Cho phép thay đổi kích thước của hộp chat
            buttonConfig: {
                logo: "https://example.com/chat-icon.png", // Logo tùy chỉnh cho nút chat
                size: 70, // Kích thước nút chat (px)
                shadow: "0 8px 25px rgba(0, 123, 255, 0.6)", // Đổ bóng tùy chỉnh
                position: { x: 20, y: 20 } // Vị trí cố định (từ góc trên bên trái)
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
      // Thông tin cơ bản (bắt buộc)
      platformUserId: "YOUR_PLATFORM_USER_ID",
      userName: "YOUR_USER_NAME",
      apiToken: "YOUR_API_TOKEN",
      apiBaseUrl: "https://bot.rockship.xyz/api/v1",
      
      // Tùy chỉnh giao diện
      theme: {
        primaryColor: "#007bff",
        textColor: "#212529",
        backgroundColor: "#ffffff"
      },
      position: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
      welcomeMessage: "Chào mừng bạn! Tôi có thể giúp gì được?",
      
      // Tùy chỉnh nâng cao (mới v1.2.0)
      supportAgentName: "Hỗ trợ khách hàng",  // Thay vì "Rockship Support"
      headerLogo: "https://example.com/logo.png",  // Logo trong header
      isResizable: true,  // Cho phép kéo thả để thay đổi kích thước hộp chat
      
      // Cấu hình nút chat
      buttonConfig: {
        logo: "https://example.com/chat-icon.png",  // Logo tùy chỉnh
        size: 70,                          // Kích thước nút (px)
        shadow: "0 8px 25px rgba(0, 123, 255, 0.6)",  // Đổ bóng
        position: { x: 20, y: 20 }         // Vị trí cố định (tùy chọn)
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
  // Thông tin cơ bản (bắt buộc)
  userName: 'YOUR_USER_NAME',
  platformUserId: 'YOUR_PLATFORM_USER_ID',
  apiToken: 'YOUR_API_TOKEN', // required for authentication
  apiBaseUrl: 'https://bot.rockship.xyz/api/v1', // optional
  
  // Giao diện cơ bản
  theme: {
    primaryColor: '#007bff',
    backgroundColor: '#f8f9fa',
    textColor: '#333'
  },
  position: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  welcomeMessage: 'Chào bạn, tôi có thể giúp gì cho bạn hôm nay?',
  
  // Tùy chỉnh nâng cao (mới v1.2.0)
  supportAgentName: 'Hỗ trợ của Tôi',  // Tên hiển thị trong header
  headerLogo: 'https://example.com/logo.png',  // Logo hiển thị trong header
  isResizable: true,  // Cho phép thay đổi kích thước hộp chat
  
  // Cấu hình nút chat đầy đủ
  buttonConfig: {
    logo: 'https://example.com/chat-icon.png',  // Logo tùy chỉnh
    size: 70,  // Kích thước nút (px)
    shadow: '0 8px 25px rgba(0, 123, 255, 0.6)',  // Đổ bóng
    position: { x: 20, y: 20 }  // Vị trí cố định
  }
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
    // Cấu hình cơ bản
    userName: 'YOUR_USER_NAME',
    platformUserId: 'YOUR_PLATFORM_USER_ID',
    apiToken: 'YOUR_API_TOKEN',
    
    // Giao diện và vị trí
    theme: {
      primaryColor: '#007bff',
      backgroundColor: '#f8f9fa',
      textColor: '#333'
    },
    position: 'bottom-right',
    
    // Tùy chỉnh mới (v1.2.4)
    supportAgentName: 'Tiếp đón viên',
    headerLogo: 'https://example.com/logo.png',
    isResizable: true,
    buttonConfig: {
      logo: 'https://example.com/icon.png',
      size: 65,
      position: { x: 30, y: 100 }
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
    <!-- Đừng quên import CSS -->
    <link rel="stylesheet" href="https://unpkg.com/rockship-chatbot-sdk/dist/styles.css">
</head>
<body>
    <div id="root">
        <h1>My Website</h1>
    </div>

    <script>
        // Khởi tạo chatbot
        const chatbot = new window.RockshipChatbotSDK({
            // Cấu hình cơ bản
            userName: 'YOUR_USER_NAME',
            platformUserId: 'YOUR_PLATFORM_USER_ID',
            apiToken: 'YOUR_API_TOKEN',
            apiBaseUrl: 'https://bot.rockship.xyz/api/v1',
            
            // Giao diện
            theme: {
                primaryColor: '#007bff',
                backgroundColor: '#f8f9fa',
                textColor: '#333'
            },
            position: 'bottom-right',
            welcomeMessage: 'Chào bạn, tôi có thể giúp gì cho bạn hôm nay?',
            
            // Cấu hình nâng cao (mới v1.2.0)
            supportAgentName: 'Hỗ trợ trực tuyến',
            headerLogo: 'https://example.com/logo.png',
            isResizable: true,
            
            // Tùy chỉnh nút chat
            buttonConfig: {
                logo: 'https://example.com/chat-icon.png',
                size: 60,
                shadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
                position: { x: 30, y: 30 }
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
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';  // Vị trí mặc định của chatbot
  welcomeMessage?: string;             // Tin nhắn chào mừng
  
  // Tùy chỉnh mới
  supportAgentName?: string;           // Tên của người hỗ trợ (mặc định: "Rockship Support")
  headerLogo?: string;                 // URL hình ảnh logo hiển thị trong header
  isResizable?: boolean;               // Cho phép thay đổi kích thước của hộp chat
  buttonConfig?: {
    logo?: string;                     // URL hình ảnh logo cho nút chat
    size?: number;                     // Kích thước nút chat (pixel)
    shadow?: string;                   // Đổ bóng tùy chỉnh
    position?: {                       // Vị trí cố định
      x?: number;                      // Vị trí theo trục X (pixel từ góc trái)
      y?: number;                      // Vị trí theo trục Y (pixel từ góc trên)
    };
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

## Tính Năng Mới v1.2.4

### 1. Nút Chat Nổi Bật

- Hiệu ứng chuyển động pulsing làm nút Chat nổi bật hơn
- Tùy chỉnh kích thước, màu sắc và đổ bóng
- Giao diện tối giản chỉ hiển thị logo

### 2. Tùy Chỉnh Tên Agent

- Thay đổi được tên Agent hiển thị thay vì mặc định "Rockship Support"
- Tên hiển thị trong header của hộp chat

### 3. Liên Kết Mở Trong Tab Mới

- Tất cả liên kết trong trò chuyện đều mở trong tab mới
- Không làm gián đoạn trải nghiệm của người dùng trên trang của bạn

### 4. Hộp Chat Có Thể Điều Chỉnh Kích Thước

- Kích thước có thể được điều chỉnh bằng cách kéo thả từ góc trái trên
- Hữu ích khi cần xem ảnh hoặc tin nhắn dài

### 5. Kéo Thả Nút Chat

- Nút chat có thể được kéo đến bất kỳ vị trí nào trên màn hình
- Vị trí có thể được cấu hình trước qua buttonConfig

### 6. Tùy Chỉnh Toàn Diện

- Logo tùy chỉnh cho cả nút chat và header
- Màu sắc, kích thước và vị trí đều có thể tùy chỉnh

## Lịch Sử Cập Nhật

### Phiên bản 1.2.4

- Loại bỏ text tooltip khi hover vào nút chat
- Di chuyển nút resize lên góc trái trên của box chat
- Cải thiện trải nghiệm kéo thả nút chat
- Sửa các lỗi liên quan đến React Hooks

### Phiên bản 1.2.0 - 1.2.3

- Thêm tính năng tùy chỉnh toàn diện cho chatbot
- Hỗ trợ kéo thả nút chat theo mọi hướng
- Thêm khả năng thay đổi kích thước hộp chat
- Cải thiện hiển thị liên kết (mở trong tab mới)
- Tùy chỉnh tên và logo agent hỗ trợ

## Support

Nếu bạn gặp vấn đề, vui lòng tạo issue trên GitHub repository.

Hoặc liên hệ trực tiếp tại [support@rockship.xyz](mailto:support@rockship.xyz)
