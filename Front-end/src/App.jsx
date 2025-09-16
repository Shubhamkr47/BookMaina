import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
  // Optional: Hide Navbar on login/register pages
  // const location = useLocation();
  // const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {/* {!hideNavbar && <Navbar />} */}
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
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

        {/* Student Routes */}
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

        {/* 404 Fallback */}
        <Route path="*" element={<div style={{ padding: 20 }}>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
