/**
 * Website Monitor Desktop Application
 * Developed by Acquibi
 * https://github.com/Acquibi
 */

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose protected methods that allow the renderer process to use
 * ipcRenderer without exposing the entire object
 * This maintains security through context isolation
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // Start monitoring with provided configuration
  startMonitoring: (config) => ipcRenderer.invoke('start-monitoring', config),
  
  // Stop the monitoring service
  stopMonitoring: () => ipcRenderer.invoke('stop-monitoring'),
  
  // Get current configuration
  getConfig: () => ipcRenderer.invoke('get-config'),
  
  // Get monitoring statistics
  getStats: () => ipcRenderer.invoke('get-stats'),
  
  // Send a test Discord notification
  sendTestNotification: () => ipcRenderer.invoke('send-test-notification'),
  
  // Listen for status updates from main process
  onStatusUpdate: (callback) => {
    ipcRenderer.on('status-update', (event, data) => callback(data));
  }
});
