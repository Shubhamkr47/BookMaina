import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LibraryBackground from '../../components/LibraryBackground';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.post('/auth/register', {
        ...form,
        role: form.role || 'student',
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message);
    }
  };

  return (
    <>
      <LibraryBackground />
      <Box sx={{ minHeight: 'calc(100vh - 78px)', display: 'grid', placeItems: 'center', px: 2, py: 5 }}>
        <Paper sx={{ p: { xs: 3, sm: 4.5 }, width: 'min(100%, 460px)', borderRadius: 6, bgcolor: 'rgba(255,255,255,0.9)' }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 700 }}>
            New Account
          </Typography>
          <Typography variant="h4" sx={{ mb: 1 }}>Join BookMania</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Create an admin or student account and start managing the library experience.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField label="Name" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} required />
            <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={form.email} onChange={handleChange} required />
            <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={form.password} onChange={handleChange} required />
            <TextField label="Role (admin/student)" name="role" fullWidth margin="normal" value={form.role} onChange={handleChange} />
            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" fullWidth>
                Register
              </Button>
              <Button variant="text" fullWidth onClick={() => navigate('/login')}>
                Already have an account? Sign in
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default Register;
