import React from 'react';
import { Box } from '@mui/material';

const orbStyle = {
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(6px)',
};

const LibraryBackground = () => (
  <Box
    aria-hidden="true"
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none',
      background:
        'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(243,248,255,0.82) 54%, rgba(238,243,249,0.95) 100%)',
    }}
  >
    <Box sx={{ ...orbStyle, top: -80, left: -60, width: 260, height: 260, background: 'rgba(173, 212, 255, 0.34)' }} />
    <Box sx={{ ...orbStyle, top: 120, right: -80, width: 300, height: 300, background: 'rgba(255, 226, 187, 0.28)' }} />
    <Box sx={{ ...orbStyle, bottom: -100, left: '18%', width: 320, height: 320, background: 'rgba(201, 223, 255, 0.20)' }} />
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        opacity: 0.55,
        backgroundImage:
          'linear-gradient(rgba(110, 145, 185, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(110, 145, 185, 0.06) 1px, transparent 1px)',
        backgroundSize: '54px 54px',
        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.8), rgba(0,0,0,0.3))',
      }}
    />
  </Box>
);

export default LibraryBackground;
