import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Lottie from 'lottie-react';
import homeAnimation from '../assets/home.json'; // Your hero animation
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Home = () => {
const navigate = useNavigate();

return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', py: 6 }}>
        
        {/* Text Section */}
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
            <MenuBookIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
        Book<span style={{ color: '#f50057' }}>Mania</span>
            </Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
            Explore and manage your library with ease. Students and admins, all in one place.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/login')}>
            Get Started
        </Button>
        </Box>

        {/* Animation Section */}
        <Box sx={{ flex: 1, mt: { xs: 6, md: 0 }, maxWidth: 500 }}>
        <Lottie animationData={homeAnimation} loop autoplay />
        </Box>
    </Container>
    </Box>
);
};

export default Home;
