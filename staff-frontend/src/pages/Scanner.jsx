import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

const Scanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    // Only initialize if we haven't already
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          // Prefer camera over file upload for speed
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] 
        },
        false
      );

      const onScanSuccess = async (decodedText) => {
        // Assume decodedText is the ID/registration number (e.g., KLU210003291)
        scanner.pause(); // Pause to prevent duplicate quick scans
        try {
          // This calls the backend to validate/log the scan!
          const response = await axios.post('http://localhost:5000/api/scan', {
            reg_no: decodedText,
            meal_type: getMealTypeByTime()
          });

          setScanResult({
            success: true,
            studentName: response.data.student?.name || 'Student',
            regNo: decodedText,
            msg: `Valid ID. Meal approved.`
          });
        } catch (err) {
          setScanResult({
            success: false,
            regNo: decodedText,
            msg: err.response?.data?.message || 'Invalid Token or Not Checked In'
          });
        }

        // Auto-resume scanner after 3 seconds
        setTimeout(() => {
          setScanResult(null);
          setErrorMsg('');
          scanner.resume();
        }, 3000);
      };

      const onScanFailure = (error) => {
        // Normally ignore failures since it just means no QR found yet
      };

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
        scannerRef.current = null;
      }
    };
  }, []);

  // Helper to guess current meal based on time for quick API logic
  const getMealTypeByTime = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'breakfast';
    if (hour < 16) return 'lunch';
    return 'dinner';
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>Digital ID Scanner</h1>
      
      <div className="card" style={{ padding: '32px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', textAlign: 'center' }}>
          Point camera at the student's Digital QR ID. Ensure lighting is adequate.
        </p>

        {/* Scanner Element target */}
        <div 
          id="reader" 
          className="scanner-container"
          style={{ width: '100%', minHeight: '300px', border: 'none' }}
        >
          {/* We rely on html5-qrcode rendering UI here */}
        </div>

        {/* Custom Status Notification overlay or below module */}
        {scanResult && (
          <div style={{
            marginTop: '24px',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: scanResult.success ? 'var(--brand-light)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${scanResult.success ? 'var(--brand-primary)' : 'var(--danger)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {scanResult.success ? 
              <CheckCircle size={32} color="var(--brand-primary)" /> : 
              <XCircle size={32} color="var(--danger)" />
            }
            <div>
              <div style={{ fontWeight: 600, fontSize: '18px', color: scanResult.success ? 'var(--brand-primary)' : 'var(--danger)' }}>
                {scanResult.regNo}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {scanResult.msg}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
