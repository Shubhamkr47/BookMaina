import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper
} from '@mui/material';
import api from '../../services/api';

const AddBook = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    year: '',
    availability: 'available',
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/books', {
        ...book,
        year: book.year ? Number(book.year) : undefined,
      });

      alert('Book added!');
      setBook({ title: '', author: '', isbn: '', category: '', year: '', availability: 'available' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to add book');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>Add New Book</Typography>

        <TextField label="Title" name="title" value={book.title} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Author" name="author" value={book.author} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="ISBN" name="isbn" value={book.isbn} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Category" name="category" value={book.category} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Year" name="year" value={book.year} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Availability" name="availability" value={book.availability} onChange={handleChange} fullWidth margin="normal" />

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
          Add Book
        </Button>
      </Paper>
    </Box>
  );
};

export default AddBook;
