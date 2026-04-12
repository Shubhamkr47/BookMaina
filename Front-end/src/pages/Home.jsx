import React from 'react';
import { Box, Typography, Button, Container, Stack, Paper } from '@mui/material';
import Lottie from 'lottie-react';
import homeAnimation from '../assets/Home.json';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import LibraryBackground from '../components/LibraryBackground';

const features = [
  { icon: <AutoStoriesOutlinedIcon color="primary" />, title: 'Smart Catalog', text: 'Track books, categories, and availability in one clean workspace.' },
  { icon: <QrCodeScannerOutlinedIcon color="primary" />, title: 'QR Workflows', text: 'Issue and return books faster with lightweight QR-based actions.' },
  { icon: <InsightsOutlinedIcon color="primary" />, title: 'Useful Dashboards', text: 'Give admins and students the exact stats they need at a glance.' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <LibraryBackground />
      <Box sx={{ minHeight: 'calc(100vh - 78px)', display: 'flex', alignItems: 'center' }}>
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 6, md: 10 },
            display: 'grid',
            gap: 4,
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            alignItems: 'center',
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '16px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(53, 103, 183, 0.10)',
                }}
              >
                <MenuBookIcon color="primary" />
              </Box>
              <Typography variant="overline" sx={{ letterSpacing: '0.22em', color: 'text.secondary', fontWeight: 700 }}>
                MODERN LIBRARY OPERATIONS
              </Typography>
            </Stack>

            <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2.6rem', md: '4.2rem' } }}>
              A brighter way to manage your library.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 620, mb: 4, mx: { xs: 'auto', md: 0 } }}>
              BookMania brings search, issue and return workflows, role-based dashboards, and notifications into one elegant system for students and admins.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <Button size="large" variant="contained" onClick={() => navigate('/login')}>
                Open Portal
              </Button>
              <Button size="large" variant="outlined" onClick={() => navigate('/register')}>
                Create Account
              </Button>
            </Stack>

            <Box
              sx={{
                mt: 4,
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              }}
            >
              {features.map((feature) => (
                <Paper key={feature.title} sx={{ p: 2.5, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.82)' }}>
                  <Box sx={{ mb: 1 }}>{feature.icon}</Box>
                  <Typography variant="subtitle1" sx={{ mb: 0.5 }}>{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{feature.text}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 6,
              bgcolor: 'rgba(255,255,255,0.78)',
              overflow: 'hidden',
            }}
          >
            <Lottie animationData={homeAnimation} loop autoplay />
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Home;
