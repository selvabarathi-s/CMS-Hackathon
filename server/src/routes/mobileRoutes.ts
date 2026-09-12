import { Router } from 'express';
import os from 'os';

export const mobileRouter = Router();

// Get local network address for QR mobile scanning
mobileRouter.get('/connection-info', (req, res) => {
  const interfaces = os.networkInterfaces();
  let localIp = '127.0.0.1';

  for (const name of Object.keys(interfaces)) {
    const netList = interfaces[name];
    if (netList) {
      for (const net of netList) {
        // Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
        if (net.family === 'IPv4' && !net.internal) {
          localIp = net.address;
          break;
        }
      }
    }
  }

  const clientPort = process.env.CLIENT_PORT || 5173;
  const mobileAccessUrl = `http://${localIp}:${clientPort}`;

  res.json({
    localIp,
    clientPort,
    mobileAccessUrl,
    apkDownloadUrl: `${mobileAccessUrl}/downloads/careerbridge-v1.0.apk`,
    pairingCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    pwaReady: true
  });
});
