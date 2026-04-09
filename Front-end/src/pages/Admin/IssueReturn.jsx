import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import QRScanner from '../../components/QRScanner';
import api from '../../services/api';

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
      const endpoint = formData.action === 'issue' ? '/issue/issue' : '/issue/return';

      await api.post(endpoint, {
        studentEmail: formData.studentEmail,
        bookId: formData.bookId,
      });

      alert(`Book ${formData.action === 'issue' ? 'issued' : 'returned'} successfully!`);
      setFormData({ studentEmail: '', bookId: '', action: 'issue' });
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Operation failed.');
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

        <QRScanner onScanSuccess={(data) => setFormData((prev) => ({ ...prev, bookId: data }))} />

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
