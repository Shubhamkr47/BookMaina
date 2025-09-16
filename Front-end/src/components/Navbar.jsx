import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ Safely parse and check the localStorage user
  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed && typeof parsed === 'object' && parsed.role) {
        user = parsed;
      } else {
        console.warn('⚠️ User is missing role or not valid:', parsed);
        localStorage.removeItem('user');
      }
    }
  } catch (err) {
    console.error('❌ Failed to parse user from localStorage:', err);
    localStorage.removeItem('user');
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <MenuBookIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">BookMania</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user?.role === 'admin' && (
            <>
              <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>Dashboard</Button>
              <Button color="inherit" onClick={() => navigate('/admin/add-book')}>Add Book</Button>
              <Button color="inherit" onClick={() => navigate('/admin/register-user')}>Register User</Button>
            </>
          )}

          {user?.role === 'student' && (
            <>
              <Button color="inherit" onClick={() => navigate('/student/dashboard')}>Dashboard</Button>
              <Button color="inherit" onClick={() => navigate('/student/search')}>Search Books</Button>
            </>
          )}

          {user && (
            <>
              <Typography variant="body2">{user.email}</Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}

          {!user && (
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
