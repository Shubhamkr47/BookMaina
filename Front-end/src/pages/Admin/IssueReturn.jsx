import React, { useState } from 'react';
import QRScanner from '../../components/QRScanner';

<QRScanner onScanSuccess={(data) => setFormData({ ...formData, bookId: data })} />

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const IssueReturn = () => {
  const [formData, setFormData] = useState({
    studentEmail: '',
    bookId: '',
    action: 'issue',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      const endpoint =
        formData.action === 'issue'
          ? '/issue-book'
          : '/return-book';

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        {
          studentEmail: formData.studentEmail,
          bookId: formData.bookId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Book ${formData.action === 'issue' ? 'issued' : 'returned'} successfully!`);
      setFormData({ studentEmail: '', bookId: '', action: 'issue' });
    } catch (err) {
      alert('Operation failed.');
    }
  };
  

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Issue / Return Book
        </Typography>

        <TextField
          label="Student Email"
          name="studentEmail"
          value={formData.studentEmail}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Book ID"
          name="bookId"
          value={formData.bookId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          select
          label="Action"
          name="action"
          value={formData.action}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="issue">Issue</MenuItem>
          <MenuItem value="return">Return</MenuItem>
        </TextField>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Paper>
    </Box>
  );
};

export default IssueReturn;
