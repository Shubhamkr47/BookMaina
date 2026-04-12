import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
import QRScanner from '../../components/QRScanner';
import api from '../../services/api';
import LibraryBackground from '../../components/LibraryBackground';

const IssueReturn = () => {
  const [formData, setFormData] = useState({
    studentEmail: '',
    bookId: '',
    action: 'issue',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [requests, setRequests] = useState([]);
  const [issues, setIssues] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchAdminData = async () => {
    try {
      const [requestsRes, issuesRes] = await Promise.all([
        api.get('/issue/requests'),
        api.get('/issue/active'),
      ]);
      setRequests(requestsRes.data);
      setIssues(issuesRes.data);
    } catch (err) {
      console.error('Failed to load admin issue data', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSubmit = async () => {
    setStatus({ type: '', message: '' });
    try {
      const endpoint = formData.action === 'issue' ? '/issue/issue' : '/issue/return';

      const res = await api.post(endpoint, {
        studentEmail: formData.studentEmail,
        bookId: formData.bookId,
      });

      setStatus({ type: 'success', message: res.data.message || 'Operation completed successfully.' });
      setFormData({ studentEmail: '', bookId: '', action: 'issue' });
      fetchAdminData();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || err.response?.data?.error || 'Operation failed.' });
    }
  };

  const handleApprove = async (requestId) => {
    setStatus({ type: '', message: '' });
    try {
      const res = await api.post(`/issue/requests/${requestId}/approve`);
      setStatus({ type: 'success', message: res.data.message });
      fetchAdminData();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to approve request' });
    }
  };

  const handleReject = async (requestId) => {
    setStatus({ type: '', message: '' });
    try {
      const res = await api.post(`/issue/requests/${requestId}/reject`);
      setStatus({ type: 'success', message: res.data.message });
      fetchAdminData();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to reject request' });
    }
  };

  const handleSendAlert = async (issueId) => {
    setStatus({ type: '', message: '' });
    try {
      const res = await api.post(`/issue/active/${issueId}/alert`);
      setStatus({ type: 'success', message: res.data.message });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send alert email' });
    }
  };

  return (
    <>
      <LibraryBackground />
      <Box className="page-container">
        <Stack spacing={3}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.88)' }}>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 700 }}>
              Circulation Desk
            </Typography>
            <Typography variant="h4" gutterBottom>Issue, return, approve, and alert</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Manage live circulation activity, review student requests, and send reminder emails to issued students.
            </Typography>

            {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}

            <Stack spacing={2}>
              <TextField label="Student Email" name="studentEmail" value={formData.studentEmail} onChange={handleChange} fullWidth />
              <TextField label="Book ID" name="bookId" value={formData.bookId} onChange={handleChange} fullWidth />
              <Paper sx={{ p: 2.5, borderRadius: 4, bgcolor: 'rgba(236,244,255,0.68)' }}>
                <QRScanner onScanSuccess={(data) => setFormData((prev) => ({ ...prev, bookId: data }))} />
              </Paper>
              <TextField select label="Action" name="action" value={formData.action} onChange={handleChange} fullWidth>
                <MenuItem value="issue">Issue</MenuItem>
                <MenuItem value="return">Return</MenuItem>
              </TextField>

              <Button variant="contained" onClick={handleSubmit} sx={{ alignSelf: 'flex-start' }}>
                Submit
              </Button>
            </Stack>
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, xl: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.88)', height: '100%' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Pending Requests</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Book</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No requests found</TableCell>
                      </TableRow>
                    ) : (
                      requests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>
                            <Typography variant="body2">{request.user?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{request.user?.email}</Typography>
                          </TableCell>
                          <TableCell>{request.book?.title}</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell align="right">
                            {request.status === 'pending' ? (
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button size="small" variant="contained" onClick={() => handleApprove(request._id)}>Approve</Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => handleReject(request._id)}>Reject</Button>
                              </Stack>
                            ) : (
                              <Typography variant="caption" color="text.secondary">Processed</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, xl: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.88)', height: '100%' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Issued Book Details</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Book</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {issues.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No active issues</TableCell>
                      </TableRow>
                    ) : (
                      issues.map((issue) => (
                        <TableRow key={issue._id}>
                          <TableCell>
                            <Typography variant="body2">{issue.user?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{issue.user?.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{issue.book?.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{issue.book?.isbn}</Typography>
                          </TableCell>
                          <TableCell>{issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '-'}</TableCell>
                          <TableCell align="right">
                            <Button size="small" variant="outlined" onClick={() => handleSendAlert(issue._id)}>
                              Send Alert
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
};

export default IssueReturn;
