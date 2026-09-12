import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (decodedText: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isOpen) {
      setScannedResult(null);
      setErrorMsg(null);

      const timer = setTimeout(() => {
        try {
          const scanner = new Html5QrcodeScanner(
            'qr-reader-container',
            { fps: 10, qrbox: { width: 220, height: 220 } },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText) => {
              setScannedResult(decodedText);
              if (onScanSuccess) onScanSuccess(decodedText);
              scanner.clear();
            },
            (errorMessage) => {
              // benign scanning frame errors can be ignored
            }
          );

          scannerRef.current = scanner;
        } catch (err: any) {
          console.warn('QR scanner camera init error:', err);
          setErrorMsg('Camera access is unavailable or restricted. You can enter a code manually below.');
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          try {
            scannerRef.current.clear();
          } catch (e) {}
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      setScannedResult(manualCode.trim());
      if (onScanSuccess) onScanSuccess(manualCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Camera QR Scanner</h2>
            <p className="text-xs text-slate-400">Scan lesson, pairing, or certificate QR codes</p>
          </div>
        </div>

        {/* Success View */}
        {scannedResult ? (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center space-y-3">
            <div className="flex justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300">QR Code Scanned Successfully!</div>
              <div className="mt-1 font-mono text-xs text-slate-200 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 break-all">
                {scannedResult}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setScannedResult(null)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-300"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Scan Another</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-500 py-2 text-xs font-bold text-white"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* HTML5 QR Container */}
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-2 min-h-[240px] flex items-center justify-center">
              <div id="qr-reader-container" className="w-full text-xs text-slate-400"></div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-950/40 border border-amber-800/40 p-2.5 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Manual Code Input */}
            <form onSubmit={handleManualSubmit} className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400">
                Or enter QR code / URL manually:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. http://192.168.1.5:5173 or CB-7829"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-xs font-bold text-white transition-colors"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
