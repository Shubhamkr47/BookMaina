import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

const Navbar = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed && typeof parsed === 'object' && parsed.role) {
        user = parsed;
      } else {
        localStorage.removeItem('user');
      }
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage:', err);
    localStorage.removeItem('user');
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar
        sx={{
          width: 'min(var(--page-max-width), calc(100% - 32px))',
          mx: 'auto',
          minHeight: 78,
          px: '0 !important',
          gap: 2,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '14px',
              bgcolor: 'rgba(53, 103, 183, 0.10)',
              color: 'primary.main',
            }}
          >
            <MenuBookRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              BookMania
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Library Management System
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {user?.role === 'admin' && (
            <>
              <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>Dashboard</Button>
              <Button color="inherit" onClick={() => navigate('/admin/add-book')}>Add Book</Button>
              <Button color="inherit" onClick={() => navigate('/admin/view-books')}>Books</Button>
              <Button color="inherit" onClick={() => navigate('/admin/issue-return')}>Issue/Return</Button>
            </>
          )}

          {user?.role === 'student' && (
            <>
              <Button color="inherit" onClick={() => navigate('/student/dashboard')}>Dashboard</Button>
              <Button color="inherit" onClick={() => navigate('/student/search')}>Search Books</Button>
            </>
          )}

          {user ? (
            <>
              <Chip
                label={user.role === 'admin' ? 'Admin' : 'Student'}
                sx={{ bgcolor: 'rgba(53, 103, 183, 0.10)', color: 'primary.main', fontWeight: 700 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                {user.email}
              </Typography>
              <Button variant="contained" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
              <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
