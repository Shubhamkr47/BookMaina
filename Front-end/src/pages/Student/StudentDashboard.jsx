import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import Lottie from "lottie-react";
import readingAnimation from "../../assets/reading.json"; // Make sure path is correct

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not logged in");

        const res = await fetch("http://localhost:8000/api/student/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load stats");

        setStats(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to fetch dashboard data.");
      }
    };

    fetchStats();
  }, []);

  if (error)
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {error}
      </Alert>
    );

  if (!user || !stats)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading your dashboard...</Typography>
      </Box>
    );

  return (
    <Container sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Books Borrowed</Typography>
              <Typography variant="h4">{stats.booksBorrowed}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Books Returned</Typography>
              <Typography variant="h4">{stats.booksReturned}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 6,
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <Lottie animationData={readingAnimation} loop autoplay />
      </Box>
    </Container>
  );
};

export default StudentDashboard;
