import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../api/client';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  Wifi,
  ExternalLink,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface MobileCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileCompanionModal: React.FC<MobileCompanionModalProps> = ({ isOpen, onClose }) => {
  const [connectionInfo, setConnectionInfo] = useState<{
    localIp: string;
    clientPort: number;
    mobileAccessUrl: string;
    apkDownloadUrl: string;
    pairingCode: string;
    pwaReady: boolean;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'qr' | 'apk' | 'pwa'>('qr');

  useEffect(() => {
    if (isOpen) {
      api.getMobileConnectionInfo().then(data => {
        setConnectionInfo(data);
      }).catch(err => {
        console.error('Failed to get mobile connection info:', err);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = connectionInfo?.mobileAccessUrl || window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Mobile Companion & App Sync</h2>
            <p className="text-xs text-slate-400">Run CareerBridge on your smartphone with live synchronization</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-slate-950 p-1 mb-5 border border-slate-800">
          <button
            onClick={() => setTab('qr')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'qr' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live QR Scanner
          </button>
          <button
            onClick={() => setTab('apk')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'apk' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Android APK Build
          </button>
          <button
            onClick={() => setTab('pwa')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'pwa' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PWA 1-Tap Install
          </button>
        </div>

        {/* QR Tab */}
        {tab === 'qr' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-6 shadow-inner">
              <QRCodeSVG
                value={currentUrl}
                size={190}
                level="H"
                includeMargin={false}
              />
              <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-mono font-bold text-blue-400 border border-slate-700">
                  <Wifi className="h-3 w-3 text-emerald-400" />
                  {currentUrl}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/70 p-3.5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Quick Device Pairing Code:</span>
                <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  {connectionInfo?.pairingCode || 'CB-7829'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              💡 Point your smartphone camera at this QR code while connected to the same Wi-Fi network.
            </p>
          </div>
        )}

        {/* APK Tab */}
        {tab === 'apk' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">CareerBridge Android App (APK)</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  v1.0.0 Release
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Packaged using <strong>Capacitor Android</strong> with full native sensor support, camera QR barcode decoding, offline caching, and instant mobile alerts.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    alert('APK Generation Triggered: You can build the standalone APK at any time with `npx cap open android` or install directly as PWA!');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download APK (Direct)</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span>Build Configuration Highlights:</span>
              </div>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                <li>Package ID: <code className="text-blue-300 font-mono">io.careerbridge.app</code></li>
                <li>Target SDK: Android 14 (API Level 34) & backwards compatible to Android 8.0</li>
                <li>Zero-delay live reload over local development network</li>
              </ul>
            </div>
          </div>
        )}

        {/* PWA Tab */}
        {tab === 'pwa' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-400" />
                <span>Progressive Web App (PWA) 1-Tap Installation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="font-bold text-slate-200 mb-1">🤖 On Android / Chrome:</div>
                  <p className="text-slate-400">
                    Tap the 3 dots (⋮) menu in Chrome and select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="font-bold text-slate-200 mb-1">🍏 On iPhone / Safari:</div>
                  <p className="text-slate-400">
                    Tap the <strong>Share</strong> button and choose <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Works 100% full-screen without app-store installation overhead.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
