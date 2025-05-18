// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Wrap any route that requires authentication.
 * If not logged in, redirect to /login.
 */
export default function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);
  const user = auth?.user;
  return user ? children : <Navigate to="/login" replace />;
}
