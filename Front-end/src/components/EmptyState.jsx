import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/empty.json';

const EmptyState = () => (
  <div style={{ width: 300, margin: '0 auto' }}>
    <Lottie animationData={animationData} loop />
  </div>
);

export default EmptyState;
