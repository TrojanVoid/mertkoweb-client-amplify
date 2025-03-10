import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = () => {
  const { user } = useContext(UserContext);
  return user && user.username !== "Guest" ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
