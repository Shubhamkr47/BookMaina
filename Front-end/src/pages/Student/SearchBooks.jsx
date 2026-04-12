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
  Chip,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import api from '../../services/api';
import LibraryBackground from '../../components/LibraryBackground';

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    isbn: '',
    availability: '',
  });
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchBooks = async (nextFilters = {}) => {
    try {
      const params = new URLSearchParams(nextFilters);
      const res = await api.get(`/books/search?${params}`);
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get('/issue/requests/me');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchBooks(newFilters);
  };

  const getRequestForBook = (bookId) => requests.find((request) => request.book?._id === bookId);

  const handleRequest = async (bookId) => {
    setStatus({ type: '', message: '' });
    try {
      const res = await api.post('/issue/request', { bookId });
      setStatus({ type: 'success', message: res.data.message });
      fetchRequests();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to request book' });
    }
  };

  return (
    <>
      <LibraryBackground />
      <Box className="page-container">
        <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 700 }}>
          Student Search
        </Typography>
        <Typography variant="h4" gutterBottom>
          Search the library
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Browse available books and send a request to the admin for approval.
        </Typography>

        {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}

        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.88)' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField name="title" label="Title" fullWidth value={filters.title} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField name="author" label="Author" fullWidth value={filters.author} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField name="isbn" label="ISBN" fullWidth value={filters.isbn} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField name="availability" label="Availability" fullWidth value={filters.availability} onChange={handleChange} />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.88)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Request Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No books found
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => {
                  const request = getRequestForBook(book._id);
                  return (
                    <TableRow key={book._id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.isbn}</TableCell>
                      <TableCell>{book.category || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={book.availability}
                          size="small"
                          sx={{
                            bgcolor: book.availability === 'available' ? 'rgba(225, 244, 229, 1)' : 'rgba(255, 240, 215, 1)',
                            color: '#274a34',
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {request ? (
                          <Chip
                            label={request.status}
                            size="small"
                            sx={{
                              bgcolor:
                                request.status === 'approved'
                                  ? 'rgba(225, 244, 229, 1)'
                                  : request.status === 'rejected'
                                    ? 'rgba(255, 228, 228, 1)'
                                    : 'rgba(236, 244, 255, 1)',
                              fontWeight: 700,
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">No request</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end">
                          <Button
                            variant="contained"
                            size="small"
                            disabled={Boolean(request)}
                            onClick={() => handleRequest(book._id)}
                          >
                            Request Book
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
};

export default SearchBooks;
