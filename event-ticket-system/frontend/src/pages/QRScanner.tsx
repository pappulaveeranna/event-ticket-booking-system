import React, { useRef, useState } from "react";
import { ticketAPI } from '../services/api';
import { BrowserMultiFormatReader } from "@zxing/browser";
import './QRScanner.css';

interface ScanResult {
  status: "VALID" | "INVALID" | "USED" | "ERROR";
  message: string;
  ticketId?: string;
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
  userEmail?: string;
  validationTime?: string;
}

const QRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanInterval, setScanInterval] = useState<NodeJS.Timeout | null>(null);
  const [isValidating, setIsValidating] = useState(false);

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

      // Use ZXing's built-in video scanning
      try {
        let lastScannedCode = '';
        const result = await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
          if (result && !isValidating) {
            const qrData = result.getText();
            // Prevent scanning the same code multiple times
            if (qrData !== lastScannedCode) {
              console.log('QR Found:', qrData);
              lastScannedCode = qrData;
              setIsValidating(true);
              stopScanning();
              // Add a small delay to ensure camera stops before validation
              setTimeout(() => {
                validateQR(qrData);
              }, 500);
            }
          }
        });
      } catch (err) {
        console.error('ZXing scanning error:', err);
      }

    } catch (e) {
      alert("Camera permission denied or not available");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setIsValidating(false);
  };

  const validateQR = async (qrCode: string) => {
    if (isValidating) return;

    try {
      const res = await ticketAPI.validateTicket(qrCode);
      const data = res.data;

      setResult({
        status: data.valid ? "VALID" : "INVALID",
        message: data.message,
        ticketId: data.ticketId,
        eventName: data.eventName,
        eventDate: data.eventDate,
        eventLocation: data.eventLocation,
        userEmail: data.userEmail,
        validationTime: data.validationTime
      });
    } catch (err: any) {
      setResult({
        status: "ERROR",
        message: err.response?.data?.error || "Invalid Ticket"
      });
    } finally {
      setIsValidating(false);
    }
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
          {result && (
            <div className={`result-section ${result.status.toLowerCase()}`}>
              <h3>{result.status}</h3>
              <p>{result.message}</p>

              {result.status === "VALID" && result.eventName && (
                <div className="ticket-details">
                  <h4>Ticket Verified Successfully</h4>
                  <div className="detail-row">
                    <span className="detail-label">Ticket ID</span>
                    <span className="detail-value">#{result.ticketId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Event</span>
                    <span className="detail-value">{result.eventName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{result.eventLocation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date & Time</span>
                    <span className="detail-value">{new Date(result.eventDate || '').toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Holder Email</span>
                    <span className="detail-value">{result.userEmail}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Validation Time</span>
                    <span className="detail-value">{new Date(result.validationTime || '').toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;