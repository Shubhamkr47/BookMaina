import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');

  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error('❌ Error parsing user from localStorage:', err);
    localStorage.removeItem('user'); // Clean up invalid data
  }

  // ✅ Debug logs to see what's happening
  console.log('🔐 Token:', token);
  console.log('👤 User:', user);

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    console.warn(`🚫 Access denied: User role '${user.role}' !== required role '${role}'`);
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
