# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-01

### Added
- Initial release of Website Monitor Desktop App
- Real-time website monitoring (60-second intervals)
- Discord webhook integration with professional embeds
- System tray support for background operation
- Cyberpunk-inspired UI with live statistics
- Status change detection (UP ↔ DOWN)
- Real-time latency tracking
- Cross-platform support (Windows, macOS, Linux)
- Stateless architecture (no database/JSON files)
- Test notification feature
- Live statistics dashboard (Total Checks, Uptime, Downtime)

### Features
- **Monitoring Engine**: Automated website health checks
- **Discord Notifications**: Color-coded embeds (Green/Red)
- **System Tray**: Minimize to tray, continues monitoring
- **Live UI**: Real-time status updates via IPC
- **Security**: Context isolation, secure preload bridge
- **Build System**: Electron Builder for .exe/.dmg/.AppImage

### Technical Details
- Electron 28.0.0
- Node.js backend with Axios
- Tailwind CSS for styling
- Custom cyberpunk theme
- IPC-based architecture

---

## Future Releases

### [1.1.0] - Planned
- [ ] Multiple website monitoring
- [ ] Customizable check intervals
- [ ] Notification sound effects
- [ ] Enhanced statistics with graphs

### [1.2.0] - Planned
- [ ] Email notifications
- [ ] Slack integration
- [ ] Telegram integration
- [ ] Export statistics to CSV

### [2.0.0] - Planned
- [ ] Cloud sync capabilities
- [ ] Mobile companion app
- [ ] Advanced analytics dashboard
- [ ] Custom alert rules

---

## Version History

- **1.0.0** - Initial public release

---

[1.0.0]: https://github.com/Acquibi/website-monitor-desktop/releases/tag/v1.0.0
