import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Paper
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LibraryBackground from '../../components/LibraryBackground';

const StatCard = ({ icon, label, value, tone }) => (
  <Card sx={{ bgcolor: tone, borderRadius: 5 }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
      <Box sx={{ width: 54, height: 54, borderRadius: '18px', display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,0.76)' }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h4">{value}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!localStorage.getItem('token')) {
          setError('You are not logged in.');
          return;
        }

        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Unable to load dashboard statistics.');
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  if (!stats) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading dashboard stats...</Typography>
      </Box>
    );
  }

  return (
    <>
      <LibraryBackground />
      <Box className="page-container">
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.84)' }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 700 }}>
            Admin Overview
          </Typography>
          <Typography variant="h3" sx={{ mb: 1 }}>Manage your library with clarity.</Typography>
          <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 680 }}>
            Review activity, maintain the catalog, and move quickly between book management and issue/return operations.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard icon={<LibraryBooksIcon color="primary" fontSize="large" />} label="Total Books" value={stats.totalBooks} tone="rgba(229, 239, 255, 0.95)" />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard icon={<PeopleIcon color="primary" fontSize="large" />} label="Total Students" value={stats.totalStudents} tone="rgba(246, 236, 227, 0.96)" />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard icon={<AssignmentReturnIcon color="primary" fontSize="large" />} label="Books Issued" value={stats.booksIssued} tone="rgba(235, 244, 236, 0.96)" />
            </Grid>
          </Grid>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
            <Button variant="contained" onClick={() => navigate('/admin/add-book')}>Add Book</Button>
            <Button variant="outlined" onClick={() => navigate('/admin/view-books')}>View Books</Button>
            <Button variant="outlined" onClick={() => navigate('/admin/issue-return')}>Issue / Return</Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default AdminDashboard;
