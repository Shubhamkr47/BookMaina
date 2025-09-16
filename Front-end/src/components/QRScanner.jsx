import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box, Typography } from '@mui/material';

const QRScanner = ({ onScanSuccess }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
        scanner.clear(); // Stop scanning after success
      },
      (error) => {
        console.warn('QR scan error', error);
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error('QR clear error', error);
      });
    };
  }, [onScanSuccess]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📷 Scan Book QR Code
      </Typography>
      <div id="reader" style={{ width: '100%' }}></div>
    </Box>
  );
};

export default QRScanner;
