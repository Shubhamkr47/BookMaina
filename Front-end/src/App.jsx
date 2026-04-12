import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

import AdminDashboard from './pages/Admin/AdminDashboard';
import AddBook from './pages/Admin/AddBook';
import ViewBooks from './pages/Admin/ViewBooks';
import IssueReturn from './pages/Admin/IssueReturn';

import StudentDashboard from './pages/Student/StudentDashboard';
import SearchBooks from './pages/Student/SearchBooks';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';

import './App.css';

function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-book"
          element={
            <ProtectedRoute role="admin">
              <AddBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/view-books"
          element={
            <ProtectedRoute role="admin">
              <ViewBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/issue-return"
          element={
            <ProtectedRoute role="admin">
              <IssueReturn />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/search"
          element={
            <ProtectedRoute role="student">
              <SearchBooks />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div className="page-container">404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
