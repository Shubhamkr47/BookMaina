import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StatCard = ({ icon, label, value }) => (
  <Card sx={{ bgcolor: '#f5f5f5', boxShadow: 3 }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {icon}
      <Box>
        <Typography variant="subtitle1" color="primary">{label}</Typography>
        <Typography variant="h5" fontWeight="bold">{value}</Typography>
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
        console.error('Error loading stats:', err.message);
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Unable to load dashboard statistics.');
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <Alert severity="error" sx={{ p: 4 }}>{error}</Alert>;
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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">Admin Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<LibraryBooksIcon color="primary" fontSize="large" />}
            label="Total Books"
            value={stats.totalBooks}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<PeopleIcon color="secondary" fontSize="large" />}
            label="Total Students"
            value={stats.totalStudents}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<AssignmentReturnIcon color="action" fontSize="large" />}
            label="Books Issued"
            value={stats.booksIssued}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Admin Tools
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/add-book')}
          >
            Add Book
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/view-books')}
          >
            View Books
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/issue-return')}
          >
            Issue/Return
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 6,
          textAlign: 'center',
          bgcolor: '#f5f5f5',
          py: 4,
          px: 2,
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom>
          Analytics Coming Soon
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Charts for most borrowed books and defaulters will be shown here.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
