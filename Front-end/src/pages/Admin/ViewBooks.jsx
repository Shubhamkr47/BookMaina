import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';
import LibraryBackground from '../../components/LibraryBackground';

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    const oldBooks = [...books];
    setBooks(books.filter((book) => book._id !== bookId));

    try {
      await api.delete(`/books/${bookId}`);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || err.message);
      setBooks(oldBooks);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading books...</Typography>
      </Box>
    );
  }

  if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;

  return (
    <>
      <LibraryBackground />
      <Box className="page-container">
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.88)' }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 700 }}>
            Catalog Overview
          </Typography>
          <Typography variant="h4" gutterBottom>All Books</Typography>

          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>ISBN</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No books available
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((book) => (
                    <TableRow key={book._id} hover>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.isbn}</TableCell>
                      <TableCell>{book.category || '-'}</TableCell>
                      <TableCell>{book.year || '-'}</TableCell>
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
                      <TableCell align="right">
                        <IconButton color="error" onClick={() => handleDelete(book._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default ViewBooks;
