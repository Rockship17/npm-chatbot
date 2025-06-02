# Rockship Chatbot SDK v1.6.0

A JavaScript/TypeScript SDK for easily integrating the Rockship chatbot into your website with the latest API

## Features

- 🚀 Easy integration with just a few lines of code
- 🎨 Fully customizable interface (logo, colors, size, position)
- 🔄 Drag and drop chat button to any position on the screen (with 0.2s hold delay)
- 🖥️ Fullscreen mode toggle with customizable dimensions
- 🔗 All markdown links open in new tabs
- 💬 Chat history management with conversation selection
- 🔄 Pagination support for loading older messages
- ⚡ Written in TypeScript
- 🎭 Modern UI with animations and responsive design
- ⚛️ Compatible with React 16.8 to 19.0

## Installation

```bash
npm install rockship-chatbot-sdk
```

or

```bash
yarn add rockship-chatbot-sdk
```

or

```bash
pnpm install rockship-chatbot-sdk
```

## Usage

### Basic Integration

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rockship Chatbot Demo</title>
    <!-- Include chatbot CSS -->
    <link rel="stylesheet" href="node_modules/rockship-chatbot-sdk/dist/styles.css">
</head>
<body>
    <!-- Your website content -->
    
    <!-- Include chatbot script -->
    <script src="node_modules/rockship-chatbot-sdk/dist/index.js"></script>
    <script>
        // Initialize chatbot
        const chatbot = new RockshipChatbotSDK({
            platformUserId: "YOUR_PLATFORM_USER_ID", // User ID (required)
            userName: "YOUR_USER_NAME",     // Display name of the user
            apiToken: "YOUR_API_TOKEN",     // Authentication token (required)
            apiBaseUrl: "https://bot.rockship.xyz/api/v1", // API URL
            theme: {
                primaryColor: "#007bff",     // Primary color
                textColor: "#212529",       // Text color
                backgroundColor: "#ffffff"   // Background color
            },
            // New configuration
            supportAgentName: "My Support", // Display name of the support agent
            headerLogo: "https://example.com/logo.png", // Logo displayed in header
            fullscreenConfig: {
                width: "90vw",  // Width in fullscreen mode (default: 90vw)
                height: "90vh"  // Height in fullscreen mode (default: 90vh)
            },
            buttonConfig: {
                logo: "https://example.com/chat-icon.png", // Custom logo for chat button
                size: 70, // Chat button size (px)
                shadow: "0 8px 25px rgba(0, 123, 255, 0.6)", // Custom shadow
                position: { x: 1800, y: 800 }   // Fixed position (from top left corner)
            }
        });
        
        // Display chatbot
        chatbot.init();
    </script>
</body>
</html>
```

### Using with React

```jsx
"use client"

import React, { useEffect } from 'react';
import { RockshipChatbotSDK } from 'rockship-chatbot-sdk';
import 'rockship-chatbot-sdk/dist/styles.css';

function App() {
  useEffect(() => {
    // Initialize chatbot when component mounts
    const chatbot = new RockshipChatbotSDK({
      // Basic information (required)
      platformUserId: "YOUR_PLATFORM_USER_ID",
      userName: "YOUR_USER_NAME",
      apiToken: "YOUR_API_TOKEN",
      apiBaseUrl: "https://bot.rockship.xyz/api/v1",
      
      // UI customization
      theme: {
        primaryColor: "#007bff",
        textColor: "#212529",
        backgroundColor: "#ffffff"
      },
      position: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
      welcomeMessage: "Welcome! How can I help you today?",
      
      // Advanced customization
      supportAgentName: "Customer Support",  // Instead of "Rockship Support"
      headerLogo: "https://example.com/logo.png",  // Logo in header
      fullscreenConfig: {
        width: "90vw",  // Width in fullscreen mode (default: 90vw)
        height: "90vh"  // Height in fullscreen mode (default: 90vh)
      },
      
      // Chat button configuration
      buttonConfig: {
        logo: "https://example.com/chat-icon.png",  // Custom logo
        size: 70,                          // Button size (px)
        shadow: "0 8px 25px rgba(0, 123, 255, 0.6)",  // Shadow
        position: { x: 1800, y: 800 }           // Fixed position (optional)
      }
    });
    
    // Display chatbot
    chatbot.init();
    
    // Clean up when component unmounts
    return () => {
      chatbot.destroy();
    };
  }, []);

  return (
    <div className="App">
      {/* Your application content */}
    </div>
  );
}

export default App;
```

### Method 1: Using SDK Class (Recommended)

```javascript
import RockshipChatbotSDK from 'rockship-chatbot-sdk';

// Initialize chatbot
const chatbot = new RockshipChatbotSDK({
  // Basic information (required)
  userName: 'YOUR_USER_NAME',
  platformUserId: 'YOUR_PLATFORM_USER_ID',
  apiToken: 'YOUR_API_TOKEN', // required for authentication
  apiBaseUrl: 'https://bot.rockship.xyz/api/v1', // optional
  
  // Basic UI
  theme: {
    primaryColor: '#007bff',
    backgroundColor: '#f8f9fa',
    textColor: '#333'
  },
  position: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  welcomeMessage: 'Hello, how can I help you today?',
  
  // Advanced customization
  supportAgentName: 'My Support',  // Display name in header
  headerLogo: 'https://example.com/logo.png',  // Logo displayed in header
  fullscreenConfig: {
    width: '90vw',  // Width in fullscreen mode (default: 90vw)
    height: '90vh'  // Height in fullscreen mode (default: 90vh)
  },
  
  // Full chat button configuration
  buttonConfig: {
    logo: 'https://example.com/chat-icon.png',  // Custom logo
    size: 70,  // Button size (px)
    shadow: '0 8px 25px rgba(0, 123, 255, 0.6)',  // Shadow
    position: { x: 1800, y: 800 }    // Fixed position
  }
});

// Initialize chatbot
chatbot.init();

// Or initialize in a specific container
chatbot.init('my-chatbot-container');
```

### Method 2: Using React Component Directly

```jsx
import React from 'react';
import { Chatbot } from 'rockship-chatbot-sdk';

function App() {
  const config = {
    // Basic configuration
    userName: 'YOUR_USER_NAME',
    platformUserId: 'YOUR_PLATFORM_USER_ID',
    apiToken: 'YOUR_API_TOKEN',
    
    // UI and position
    theme: {
      primaryColor: '#007bff',
      backgroundColor: '#f8f9fa',
      textColor: '#333'
    },
    position: 'bottom-right',
    
    // Tùy chỉnh mới (v1.2.4)
    supportAgentName: 'Tiếp đón viên',
    headerLogo: 'https://example.com/logo.png',
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
```

## API Reference

### ChatbotConfig Interface

```typescript
interface ChatbotConfig {
  userName: string;                    // User name (required)
  platformUserId: string;              // User ID on the platform (required)
  apiToken: string;                    // Authentication token (required)
  apiBaseUrl?: string;                 // API base URL (default: https://bot.rockship.xyz/api/v1)
  defaultConversationAlias?: string;   // Initial conversation alias to load (optional)
  theme?: {                            // Theme customization
    primaryColor?: string;             // Primary color (default: #007bff)
    backgroundColor?: string;          // Background color (default: #ffffff)
    textColor?: string;                // Text color (default: #212529)
  };
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'; // Widget position
  welcomeMessage?: string;             // Custom welcome message
  supportAgentName?: string;           // Support agent name displayed in header
  headerLogo?: string;                 // Custom logo URL for header
  buttonConfig?: {                     // Chat button configuration
    logo?: string;                     // Custom button logo URL
    size?: number;                     // Button size in pixels (default: 60)
    shadow?: string;                   // Custom CSS shadow
    position?: { x: number; y: number }; // Fixed position on screen
  };
}
```

## New Features in v1.3.6

### Chat History

The chatbot now automatically loads the user's conversation history and allows switching between past conversations or starting new ones.

### Conversation Management

- Ability to browse past conversations
- Conversation deletion support
- Automatic loading of the most recent conversation on startup

### Pagination

The chatbot supports loading older messages when scrolling up in a conversation with automatic pagination.

## Browser Compatibility

The SDK is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## React Compatibility

Compatible with React versions 16.8 to 19.0

## Development

```bash
# Clone repository
git clone <repository-url>
cd rockship-chatbot-sdk

# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## License

MIT

## Additional Features (v1.2.4)

### 1. Enhanced Chat Button

- Pulsing animation effect makes the Chat button more noticeable
- Customizable size, color, and shadow
- Minimalist interface showing only the logo

### 2. Customizable Agent Name

- Change the displayed agent name instead of the default "Rockship Support"
- Name is displayed in the chat widget header

### 3. Links Open in New Tabs

- All links in the chat open in new browser tabs
- Does not interrupt the user experience on your page

### 4. Resizable Chat Widget

- Size can be adjusted by dragging from the top-left corner
- Useful when viewing images or long messages

### 5. Draggable Chat Button

- Chat button can be dragged to any position on the screen
- Position can be pre-configured through buttonConfig

### 6. Comprehensive Customization

- Custom logos for both chat button and header
- Colors, sizes, and positions are all customizable

## Update History

### Version 1.2.4

- Removed text tooltip when hovering over the chat button
- Moved resize handle to the top-left corner of the chat box
- Improved drag-and-drop experience for the chat button
- Fixed issues related to React Hooks

### Version 1.2.0 - 1.2.3

- Added comprehensive customization features for the chatbot
- Added support for dragging the chat button in any direction
- Added ability to resize the chat widget
- Improved link display (opening in new tabs)
- Added customization for agent name and logo

## Support

If you encounter any issues, please create an issue on the GitHub repository.

Or contact us directly at [support@rockship.xyz](mailto:support@rockship.xyz)
