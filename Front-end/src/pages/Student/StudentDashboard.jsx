import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Container,
  Paper,
} from '@mui/material';
import Lottie from 'lottie-react';
import readingAnimation from '../../assets/reading.json';
import api from '../../services/api';
import LibraryBackground from '../../components/LibraryBackground';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchStats = async () => {
      try {
        if (!localStorage.getItem('token')) throw new Error('Not logged in');

        const { data } = await api.get('/student/stats');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Unable to fetch dashboard data.');
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  if (!user || !stats) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading your dashboard...</Typography>
      </Box>
    );
  }

  return (
    <>
      <LibraryBackground />
      <Container className="page-container">
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.88)' }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 700 }}>
            Student Dashboard
          </Typography>
          <Typography variant="h3" gutterBottom>
            Welcome, {user.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Keep track of your library activity and current borrowing history from one calm workspace.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 5, bgcolor: 'rgba(229, 239, 255, 0.95)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary">Books Borrowed</Typography>
                  <Typography variant="h3">{stats.booksBorrowed}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 5, bgcolor: 'rgba(235, 244, 236, 0.96)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary">Books Returned</Typography>
                  <Typography variant="h3">{stats.booksReturned}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, maxWidth: 480, mx: 'auto' }}>
            <Lottie animationData={readingAnimation} loop autoplay />
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default StudentDashboard;
