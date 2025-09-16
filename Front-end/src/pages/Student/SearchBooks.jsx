import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
} from '@mui/material';
import axios from 'axios';

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    isbn: '',
    availability: '',
  });

  // Fetch books from backend
  const fetchBooks = async (filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(filters);

      const res = await axios.get(`http://localhost:8000/api/books/search?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    }
  };

  // Initial load - fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle filter input change
  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchBooks(newFilters); // fetch again with updated filters
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        🔍 Search Books
      </Typography>

      {/* Search Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="title"
              label="Title"
              fullWidth
              value={filters.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="author"
              label="Author"
              fullWidth
              value={filters.author}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="isbn"
              label="ISBN"
              fullWidth
              value={filters.isbn}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="availability"
              label="Availability (available/issued)"
              fullWidth
              value={filters.availability}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Books Table */}
      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Availability</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No books found 📭
                </TableCell>
              </TableRow>
            ) : (
              books.map((book, index) => (
                <TableRow key={index}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>{book.availability}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default SearchBooks;
