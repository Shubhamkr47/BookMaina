import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Input
} from '@mui/material';
import axios from 'axios';

const AddBook = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(book).forEach((key) => formData.append(key, book[key]));
      if (image) formData.append('image', image);

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/books`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Book added!');
      setBook({ title: '', author: '', isbn: '', quantity: '' });
      setImage(null);
    } catch (err) {
      console.error(err);
      alert('Failed to add book');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>Add New Book</Typography>

        <TextField label="Title" name="title" value={book.title} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Author" name="author" value={book.author} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="ISBN" name="isbn" value={book.isbn} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Quantity" name="quantity" value={book.quantity} onChange={handleChange} fullWidth margin="normal" />
        <Input type="file" onChange={handleImageChange} fullWidth sx={{ mt: 2 }} />

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
          Add Book
        </Button>
      </Paper>
    </Box>
  );
};

export default AddBook;
