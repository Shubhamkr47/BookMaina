import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Stack, Alert
} from '@mui/material';
import api from '../../services/api';
import LibraryBackground from '../../components/LibraryBackground';

const AddBook = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    year: '',
    availability: 'available',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setStatus({ type: '', message: '' });
    try {
      await api.post('/books', {
        ...book,
        year: book.year ? Number(book.year) : undefined,
      });

      setStatus({ type: 'success', message: 'Book added successfully.' });
      setBook({ title: '', author: '', isbn: '', category: '', year: '', availability: 'available' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || err.response?.data?.error || 'Failed to add book' });
    }
  };

  return (
    <>
      <LibraryBackground />
      <Box className="page-container">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, maxWidth: 760, mx: 'auto', borderRadius: 6, bgcolor: 'rgba(255,255,255,0.88)' }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 700 }}>
            Catalog Management
          </Typography>
          <Typography variant="h4" sx={{ mb: 1 }}>Add a new book</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Fill in the core details below and the book will be available in the admin and student views.
          </Typography>

          {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}

          <Stack spacing={2}>
            <TextField label="Title" name="title" value={book.title} onChange={handleChange} fullWidth />
            <TextField label="Author" name="author" value={book.author} onChange={handleChange} fullWidth />
            <TextField label="ISBN" name="isbn" value={book.isbn} onChange={handleChange} fullWidth />
            <TextField label="Category" name="category" value={book.category} onChange={handleChange} fullWidth />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Year" name="year" value={book.year} onChange={handleChange} fullWidth />
              <TextField label="Availability" name="availability" value={book.availability} onChange={handleChange} fullWidth />
            </Stack>
            <Button variant="contained" onClick={handleSubmit} sx={{ alignSelf: 'flex-start', mt: 1 }}>
              Save Book
            </Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default AddBook;
