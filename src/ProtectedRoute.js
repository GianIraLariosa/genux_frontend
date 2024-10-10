import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Assuming you're using react-router for routing
import { UserContext } from './Usercontext';

const ProtectedRoute = ({ children }) => {
  const { user_id } = useContext(UserContext);

  return user_id ? children : <Navigate to="/login" />; // Redirect to login if user is not logged in
};

export default ProtectedRoute;
