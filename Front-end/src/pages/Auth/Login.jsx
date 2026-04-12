import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LibraryBackground from '../../components/LibraryBackground';
import api from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'student') {
        navigate('/student/dashboard');
      } else {
        throw new Error('Unknown user role');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LibraryBackground />
      <Box
        sx={{
          minHeight: 'calc(100vh - 78px)',
          display: 'grid',
          placeItems: 'center',
          px: 2,
          py: 5,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: 'min(100%, 440px)',
            p: { xs: 3, sm: 4.5 },
            borderRadius: 6,
            bgcolor: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 700 }}>
            Welcome Back
          </Typography>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Sign in to BookMania
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Access your dashboard, search the catalog, and manage book activity from one place.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
              <Button variant="text" fullWidth onClick={() => navigate('/register')}>
                Don&apos;t have an account? Register
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
