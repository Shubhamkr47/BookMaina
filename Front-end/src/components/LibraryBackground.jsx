import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/empty.json';

const LibraryBackground = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh',
    zIndex: -1, opacity: 0.2, overflow: 'hidden'
  }}>
    <Lottie animationData={animationData} loop />
  </div>
);

export default LibraryBackground;
