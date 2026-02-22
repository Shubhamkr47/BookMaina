require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB().catch((err) => {
  console.error('❌ DB connect failed', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/issue', require('./routes/issueRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // Admin/user management
app.use('/api/student', require('./routes/userRoutes')); // ✅ Student dashboard (stats)

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

//  Serve Frontend (IMPORTANT FOR RENDER)
const __dirnameResolved = path.resolve();
app.use(express.static(path.join(__dirnameResolved, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnameResolved, 'client/dist', 'index.html'));
});

// Error handler (last)
app.use(errorHandler);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
