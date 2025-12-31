# Website Monitor Desktop App 🖥️

A professional cross-platform desktop application built with Electron.js for monitoring website uptime with Discord notifications. Features a sleek cyberpunk-inspired UI and runs silently in the system tray.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F?logo=electron)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)

## ✨ Features

- **Real-Time Monitoring**: Checks website status every 60 seconds
- **Discord Integration**: Sends professional embedded notifications when status changes
- **System Tray**: Runs in background with system tray integration
- **Stateless Design**: No database, no JSON files - all data stored in memory
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Modern UI**: Cyberpunk-themed interface with live statistics
- **Zero Configuration**: Simple setup with just a URL and webhook

## 🎯 Key Specifications

- **Heartbeat Interval**: 60 seconds
- **Smart Notifications**: Only triggers on status change (UP ↔ DOWN)
- **Professional Embeds**: Color-coded Discord messages (🟢 Green for UP, 🔴 Red for DOWN)
- **Live Statistics**: Total checks, uptime count, downtime count, real-time latency
- **Widget-Style UI**: Compact 400x600 window
- **Background Operation**: Continues monitoring when window is closed

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

## 🚀 Quick Start

### 1. Clone or Download the Repository

```bash
git clone https://github.com/Acquibi/website-monitor-desktop.git
cd website-monitor-desktop
```

Or download and extract the ZIP file from GitHub releases.

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Electron (v28.0.0)
- Axios (for HTTP requests)
- Electron Builder (for creating executables)

### 3. Run the Application

```bash
npm start
```

The application window will open. You can now:
1. Enter your target website URL (e.g., `https://yourwebsite.com`)
2. Enter your Discord webhook URL
3. Click "Start Monitor"

## 🔔 Setting Up Discord Webhook

1. Open your Discord server
2. Go to Server Settings → Integrations → Webhooks
3. Click "New Webhook"
4. Name it (e.g., "Website Monitor")
5. Select the channel where you want notifications
6. Copy the Webhook URL
7. Paste it into the app

## 🏗️ Building Executables

### Build for Current Platform

```bash
npm run build
```

### Build for Specific Platforms

**Windows (.exe)**
```bash
npm run build:win
```

**macOS (.dmg)**
```bash
npm run build:mac
```

**Linux (.AppImage)**
```bash
npm run build:linux
```

### Output Location

Built applications will be in the `dist/` folder:
- **Windows**: `dist/Website Monitor Setup.exe`
- **macOS**: `dist/Website Monitor.dmg`
- **Linux**: `dist/Website Monitor.AppImage`

## 📦 Project Structure

```
website-monitor-desktop/
├── main.js              # Electron main process (backend)
├── preload.js           # Secure IPC bridge
├── index.html           # UI (frontend)
├── package.json         # Dependencies and build config
├── assets/
│   └── icon.png        # Application icon
└── README.md           # This file
```

## 🎨 UI Features

- **Status Orb**: Visual indicator with animated effects
  - 🟢 Green: Website is UP
  - 🔴 Red: Website is DOWN
  - ⚪ White: Idle (not monitoring)

- **Live Latency**: Real-time response time in milliseconds

- **Statistics Dashboard**:
  - Total Checks: Total number of health checks performed
  - Uptime: Number of successful checks
  - Downtime: Number of failed checks

- **System Tray**: 
  - App stays in tray when window is closed
  - Right-click for quick actions
  - Shows current status and latency

## 🔧 Configuration

### In-App Settings

- **Target URL**: The website you want to monitor
- **Discord Webhook URL**: Where notifications are sent
- **Test Button**: Send a test notification to verify setup

### Advanced Settings (main.js)

You can modify these in `main.js`:

```javascript
checkInterval: 60000,  // Monitoring interval in ms (60 seconds)
timeout: 10000,        // Request timeout in ms (10 seconds)
```

## 🛡️ Security Notes

- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ Secure IPC communication via preload script
- ✅ No data persistence (privacy-friendly)

## 🐛 Troubleshooting

### App won't start

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Discord notifications not working

1. Verify webhook URL is correct
2. Click "Send Test Notification" button
3. Check Discord channel permissions
4. Ensure webhook is not disabled

### Build errors

```bash
# Install electron-builder globally
npm install -g electron-builder

# Try building again
npm run build
```

## 📊 Technical Details

### Architecture

- **Main Process** (`main.js`): Handles monitoring, Discord API, system tray
- **Renderer Process** (`index.html`): UI rendering and user interaction
- **IPC Bridge** (`preload.js`): Secure communication between processes

### Monitoring Logic

1. App pings target URL every 60 seconds
2. Measures response time (latency)
3. HTTP status 200-499 = UP, others = DOWN
4. Compares with previous status
5. Sends Discord notification only on status change

### Discord Embed Format

```json
{
  "title": "✅ Website is UP",
  "description": "**https://yoursite.com**",
  "color": 65280,
  "fields": [
    { "name": "Status", "value": "🟢 Online" },
    { "name": "Response Time", "value": "123ms" },
    { "name": "Timestamp", "value": "<Discord timestamp>" }
  ],
  "footer": { "text": "Powered by Acquibi" }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Add multiple website monitoring
- [ ] Customizable check intervals
- [ ] Email notifications
- [ ] Detailed history graphs
- [ ] Export statistics to CSV
- [ ] Telegram integration
- [ ] Custom notification sounds

## 💡 Use Cases

- Monitor your personal website or blog
- Track API endpoint availability
- Keep tabs on client websites
- Monitor e-commerce sites
- Development server status checks
- Production environment monitoring

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- HTTP requests via [Axios](https://axios-http.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📧 Support

If you have any questions or run into issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the troubleshooting section above

---

**Developed by Acquibi**

Star ⭐ this repository if you find it useful!
