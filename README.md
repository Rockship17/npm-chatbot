# CyHome Chatbot SDK

A lightweight, customizable chatbot SDK for CyHome integration with draggable UI.

## Features

- 🎯 Easy integration with any website
- 🎨 Customizable themes and styling
- 📱 Responsive design
- 🔄 Drag and drop floating button (vertical only)
- 💬 Real-time messaging
- 🗑️ Clear conversation functionality
- 📦 TypeScript support

## Installation

```bash
npm install cyhome-chatbot-sdk
```

## Usage

### ES6 Modules
```javascript
import CyHomeChatbot from 'cyhome-chatbot-sdk';

const chatbot = new CyHomeChatbot({
  userId: 'your-user-id',
  userName: 'User Name',
  theme: {
    primaryColor: '#007bff',
    backgroundColor: '#ffffff'
  },
  position: {
    right: '20px',
    bottom: '20px'
  }
});
```

### UMD (Script tag)
```html
<script src="https://unpkg.com/cyhome-chatbot-sdk/dist/index.umd.js"></script>
<script>
  const chatbot = new CyHomeChatbot({
    userId: 'your-user-id',
    userName: 'User Name'
  });
</script>
```

### Auto-initialization
```html
<script>
  window.CyHomeChatbotConfig = {
    userId: 'your-user-id',
    userName: 'User Name',
    theme: {
      primaryColor: '#28a745'
    }
  };
</script>
<script src="https://unpkg.com/cyhome-chatbot-sdk/dist/index.umd.js"></script>
```

## Configuration

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| userId | string | ✅ | - | User ID for API calls |
| userName | string | ✅ | - | Display name for user |
| apiBaseUrl | string | ❌ | 'https://cyhome.rockship.xyz/api/v1' | Base URL for API |
| theme.primaryColor | string | ❌ | '#007bff' | Primary color |
| theme.backgroundColor | string | ❌ | '#ffffff' | Background color |
| theme.textColor | string | ❌ | '#333333' | Text color |
| position.right | string | ❌ | '20px' | Right position |
| position.bottom | string | ❌ | '20px' | Bottom position |

## API Methods

```javascript
const chatbot = new CyHomeChatbot(config);

// Open chat programmatically
chatbot.open();

// Close chat programmatically
chatbot.close();

// Update theme
chatbot.setTheme({
  primaryColor: '#ff6b6b'
});

// Destroy chatbot
chatbot.destroy();
```

## Examples

### Basic Setup
```html
<!DOCTYPE html>
<html>
<head>
    <title>CyHome Chatbot Demo</title>
</head>
<body>
    <h1>My Website</h1>
    
    <script>
        window.CyHomeChatbotConfig = {
            userId: '12345',
            userName: 'thiep'
        };
    </script>
    <script src="https://unpkg.com/cyhome-chatbot-sdk/dist/index.umd.js"></script>
</body>
</html>
```

### Custom Theme
```javascript
const chatbot = new CyHomeChatbot({
  userId: '12345',
  userName: 'thiep',
  theme: {
    primaryColor: '#ff6b6b',
    backgroundColor: '#f8f9fa',
    textColor: '#2c3e50'
  },
  position: {
    right: '30px',
    bottom: '30px'
  }
});
```

## Development

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Publish to npm
npm publish
```

## API Integration

The SDK integrates with CyHome APIs:

- **Send Message**: `POST /api/v1/cyhome/invoke`
- **Get Messages**: `GET /api/v1/message/:customer_id`
- **Get Conversation**: `GET /api/v1/conversation/:customer_id`
- **Clear Conversation**: `DELETE /api/v1/conversation/:conversation_id`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT