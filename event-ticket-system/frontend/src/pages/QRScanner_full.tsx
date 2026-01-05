import React, { useRef, useState } from "react";
import { ticketAPI } from '../services/api';
import { BrowserMultiFormatReader } from "@zxing/browser";
import './QRScanner.css';

interface ScanResult {
  status: "VALID" | "INVALID" | "USED" | "ERROR";
  message: string;
}

const QRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanInterval, setScanInterval] = useState<NodeJS.Timeout | null>(null);

  const codeReader = new BrowserMultiFormatReader();

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const interval = setInterval(async () => {
        if (!videoRef.current || !isScanning) {
          clearInterval(interval);
          return;
        }

        try {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) return;

          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0);

          const dataUrl = canvas.toDataURL('image/png');
          const result = await codeReader.decodeFromImageUrl(dataUrl);
          
          if (result) {
            const qrData = result.getText();
            clearInterval(interval);
            stopScanning();
            await validateQR(qrData);
          }
        } catch (err) {
          // Continue scanning
        }
      }, 300);

      setScanInterval(interval);
    } catch (e) {
      alert("Camera permission denied or not available");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const validateQR = async (qrCode: string) => {
    try {
      const res = await ticketAPI.validateTicket(qrCode);
      setResult({
        status: res.data.valid ? "VALID" : "INVALID",
        message: res.data.message
      });
    } catch (err: any) {
      setResult({
        status: "ERROR",
        message: err.response?.data?.error || "Invalid Ticket"
      });
    }
  };

  const handleManual = () => {
    if (manualCode.trim()) validateQR(manualCode);
    setManualCode("");
  };

  return (
    <div className="qr-scanner-container">
      <div className="scanner-header">
        <h1>🎟 QR Ticket Validator</h1>
      </div>

      <div className="scanner-content">
        <div className="camera-section">
          <div className="camera-container">
            {!isScanning ? (
              <div className="camera-placeholder">
                <button className="start-camera-btn" onClick={startScanning}>
                  Start Camera
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="camera-feed"
                  muted
                  playsInline
                  autoPlay
                />
                <div className="scan-overlay">
                  <div className="scan-frame">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {isScanning && (
            <div className="camera-controls">
              <button className="validate-btn" onClick={stopScanning}>
                Stop Camera
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="manual-section">
            <h3>Manual Validation</h3>
            <div className="manual-input">
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Paste QR Code"
              />
              <button className="validate-btn" onClick={handleManual}>
                Validate
              </button>
            </div>
          </div>

          {result && (
            <div className={`result-section ${result.status.toLowerCase()}`}>
              <h3>{result.status}</h3>
              <p>{result.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;