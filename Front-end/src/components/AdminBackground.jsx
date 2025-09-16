import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/admin.json'; // Make sure this file exists

const AdminBackground = () => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    opacity: 0.15,
    overflow: 'hidden'
  }}>
    <Lottie animationData={animationData} loop autoplay />
  </div>
);

export default AdminBackground;
