# Frontend

This directory contains the frontend components of the Sample Mini App, including H5 web pages and DSL (Domain Specific Language) configurations.

## 📁 Directory Structure

```
frontend/
├── H5/                 # H5 web pages for mobile web integration
│   └── authCode.html   # Authentication code demonstration page
├── DSL/                # Domain Specific Language configurations
│   └── .gitkeep        # Placeholder file
```

## 🎯 H5 Directory

The `H5/` directory contains web pages designed to work within SuperQi's mini app environment using the Hylid Bridge for native API access.

### Features

- **Mobile-optimized**: Responsive design with mobile-first approach
- **Native API Integration**: Uses Hylid Bridge to access SuperQi's native APIs
- **Modern UI**: Built with Tailwind CSS for clean, modern styling
- **Interactive Examples**: Demonstrates real API usage patterns

### Available Pages

#### `authCode.html`
A demonstration page that showcases the `my.getAuthCode()` API functionality.

**Key Features:**
- Authentication code retrieval with multiple scopes (`auth_base`, `USER_ID`)
- Real-time result display
- Copy-to-clipboard functionality
- Error handling and user feedback

**Technologies Used:**
- Hylid Bridge v2.10.0 for native API access
- Tailwind CSS v4 for styling
- Vanilla JavaScript for interactivity

**Usage:**
1. Open the page in a SuperQi mini app environment
2. Click the "my.getAuthCode()" button to request authentication
3. View the result in the display area
4. Use "Copy to Clipboard" to copy the auth code

## 🔧 DSL Directory

The `DSL/` directory is reserved for Domain Specific Language configurations. This space is intended for:

- Mini app configuration files
- Layout definitions
- Component schemas
- Platform-specific configurations

*Note: Currently contains a placeholder file. DSL configurations will be added as the project evolves.*

## 🚀 Getting Started

### Prerequisites

- SuperQi mini app environment
- Hylid Bridge integration
- Modern web browser with JavaScript enabled

### Development

1. **Local Development:**
   ```bash
   # Navigate to the frontend directory
   cd frontend
   
   # Serve H5 pages locally (using any static file server)
   python -m http.server 8000
   # or
   npx serve .
   ```

2. **Testing in SuperQi Environment:**
   - Deploy the H5 pages to your mini app hosting
   - Test the native API integrations within the SuperQi app

### API Integration

The H5 pages demonstrate integration with SuperQi's native APIs through Hylid Bridge:

```javascript
// Example: Getting authentication code
my.getAuthCode({
    scopes: ['auth_base', 'USER_ID'],
    success: (res) => {
        console.log('Auth Code:', res.authCode);
    },
    fail: (res) => {
        console.error('Auth Error:', res.authErrorScopes);
    },
});
```

## 📱 Mobile Optimization

All H5 pages are optimized for mobile devices with:

- Responsive viewport settings
- Touch-friendly interface elements
- Mobile-specific meta tags
- Optimized for SuperQi's mini app container

## 🎨 Styling

The frontend uses Tailwind CSS for consistent, modern styling:

- Utility-first CSS framework
- Mobile-responsive design
- Consistent color scheme (yellow accent color)
- Clean, professional appearance

## 🔗 Related Documentation

- [SuperQi Developers Guide](https://superqi.qi-mobile.tech/)
- [SuperQI Miniapps Console](https://miniapps.qi.iq/gotoconsole)
- [Hylid Bridge Documentation](https://cdn.marmot-cloud.com/npm/hylid-bridge/)

## 📄 License

This project is licensed under the MIT License - see the main [LICENSE](../LICENSE) file for details.
