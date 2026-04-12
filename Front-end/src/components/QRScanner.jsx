import React, { useEffect, useMemo, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box, Typography, Button, Stack } from '@mui/material';

const QRScanner = ({ onScanSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scannerId = useMemo(() => `reader-${Math.random().toString(36).slice(2, 9)}`, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const scanner = new Html5QrcodeScanner(scannerId, {
      fps: 10,
      qrbox: 220,
    });

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
        setIsOpen(false);
        scanner.clear().catch(() => {});
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isOpen, onScanSuccess, scannerId]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1">Scan Book QR Code</Typography>
        <Button variant={isOpen ? 'outlined' : 'contained'} onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? 'Close Camera' : 'Open Camera'}
        </Button>
      </Stack>
      {isOpen && <div id={scannerId} style={{ width: '100%' }}></div>}
    </Box>
  );
};

export default QRScanner;
