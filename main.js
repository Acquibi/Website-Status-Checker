/**
 * Website Monitor Desktop Application
 * Developed by Acquibi
 * https://github.com/Acquibi
 */

const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron');
const path = require('path');
const axios = require('axios');

// Application state (in-memory only, no persistence)
let mainWindow = null;
let tray = null;
let monitoringInterval = null;

// Runtime configuration (stateless - resets on app restart)
let config = {
  targetUrl: '',
  webhookUrl: '',
  isMonitoring: false,
  checkInterval: 60000, // 60 seconds
  lastStatus: null, // null, 'up', or 'down'
  stats: {
    totalChecks: 0,
    uptime: 0,
    downtime: 0,
    lastCheckTime: null,
    currentLatency: null
  }
};

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    frame: true,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile('index.html');

  // Uncomment for development
  // mainWindow.webContents.openDevTools();

  // Handle window close - minimize to tray instead
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      
      // Show notification that app is still running
      if (tray) {
        tray.displayBalloon({
          title: 'Website Monitor',
          content: 'App is still running in the system tray',
          icon: nativeImage.createFromPath(path.join(__dirname, 'assets', 'icon.png'))
        });
      }
    }
    return false;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Create system tray icon and menu
 */
function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    {
      label: 'Status: ' + (config.isMonitoring ? 'Monitoring' : 'Idle'),
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Website Monitor');
  tray.setContextMenu(contextMenu);

  // Double-click to show window
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

/**
 * Send Discord Notification with Professional Embed
 * Only triggers when status changes (UP -> DOWN or DOWN -> UP)
 * @param {string} status - 'up' or 'down'
 * @param {number} latency - Response time in ms
 * @param {string} url - Target URL
 */
async function sendDiscordNotification(status, latency, url) {
  if (!config.webhookUrl) {
    console.log('No webhook URL configured');
    return;
  }

  const isUp = status === 'up';
  const timestamp = new Date().toISOString();

  const embed = {
    title: isUp ? '✅ Website is UP' : '🔴 Website is DOWN',
    description: `**${url}**`,
    color: isUp ? 0x00ff00 : 0xff0000, // Green or Red
    fields: [
      {
        name: 'Status',
        value: isUp ? '🟢 Online' : '🔴 Offline',
        inline: true
      },
      {
        name: 'Response Time',
        value: latency ? `${latency}ms` : 'N/A',
        inline: true
      },
      {
        name: 'Timestamp',
        value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
        inline: false
      }
    ],
    footer: {
      text: 'Powered by Acquibi',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
    },
    timestamp: timestamp
  };

  try {
    await axios.post(config.webhookUrl, {
      embeds: [embed],
      username: 'Website Monitor',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
    });
    console.log(`Discord notification sent: ${status}`);
  } catch (error) {
    console.error('Failed to send Discord notification:', error.message);
  }
}

/**
 * Perform website health check
 */
async function checkWebsiteStatus() {
  if (!config.targetUrl) {
    return;
  }

  const startTime = Date.now();
  let status = 'down';
  let latency = null;

  try {
    const response = await axios.get(config.targetUrl, {
      timeout: 10000,
      validateStatus: (status) => status < 500 // Consider 4xx as "up"
    });

    latency = Date.now() - startTime;

    if (response.status >= 200 && response.status < 500) {
      status = 'up';
      config.stats.uptime++;
    } else {
      config.stats.downtime++;
    }
  } catch (error) {
    latency = Date.now() - startTime;
    status = 'down';
    config.stats.downtime++;
  }

  config.stats.totalChecks++;
  config.stats.lastCheckTime = new Date();
  config.stats.currentLatency = latency;

  // CRITICAL: Send notification ONLY if status changed
  if (config.lastStatus !== null && config.lastStatus !== status) {
    await sendDiscordNotification(status, latency, config.targetUrl);
  }

  config.lastStatus = status;

  // Send status update to renderer
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('status-update', {
      status,
      latency,
      stats: config.stats,
      targetUrl: config.targetUrl
    });
  }

  // Update tray menu
  updateTrayMenu();
}

/**
 * Update system tray menu with current status
 */
function updateTrayMenu() {
  if (!tray) return;

  const statusEmoji = config.lastStatus === 'up' ? '🟢' : (config.lastStatus === 'down' ? '🔴' : '⚪');
  const monitoringStatus = config.isMonitoring ? 'Monitoring' : 'Idle';

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    {
      label: `Status: ${statusEmoji} ${monitoringStatus}`,
      enabled: false
    },
    {
      label: config.stats.currentLatency ? `Latency: ${config.stats.currentLatency}ms` : 'Latency: N/A',
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

/**
 * Start monitoring
 */
function startMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }

  config.isMonitoring = true;
  
  // Immediate check
  checkWebsiteStatus();

  // Set up interval (60 seconds)
  monitoringInterval = setInterval(checkWebsiteStatus, config.checkInterval);

  console.log('Monitoring started for:', config.targetUrl);
}

/**
 * Stop monitoring
 */
function stopMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }

  config.isMonitoring = false;
  config.lastStatus = null;

  console.log('Monitoring stopped');
  updateTrayMenu();
}

// IPC Handlers - Communication between main and renderer process
ipcMain.handle('start-monitoring', async (event, { targetUrl, webhookUrl }) => {
  config.targetUrl = targetUrl;
  config.webhookUrl = webhookUrl;
  
  // Reset stats for new monitoring session
  config.stats = {
    totalChecks: 0,
    uptime: 0,
    downtime: 0,
    lastCheckTime: null,
    currentLatency: null
  };

  startMonitoring();
  
  return { success: true, message: 'Monitoring started' };
});

ipcMain.handle('stop-monitoring', async () => {
  stopMonitoring();
  return { success: true, message: 'Monitoring stopped' };
});

ipcMain.handle('get-config', async () => {
  return {
    targetUrl: config.targetUrl,
    webhookUrl: config.webhookUrl,
    isMonitoring: config.isMonitoring
  };
});

ipcMain.handle('get-stats', async () => {
  return config.stats;
});

ipcMain.handle('send-test-notification', async () => {
  if (!config.webhookUrl) {
    return { success: false, message: 'No webhook URL configured' };
  }

  try {
    await sendDiscordNotification('up', 123, config.targetUrl || 'https://example.com');
    return { success: true, message: 'Test notification sent to Discord' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// App lifecycle events
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Keep app running on all platforms when windows are closed
  // User must quit from tray menu
});

app.on('before-quit', () => {
  stopMonitoring();
});
