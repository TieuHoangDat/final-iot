import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('username'); // Kiểm tra xem đã đăng nhập chưa

  return isLoggedIn ? children : <Navigate to="/login" />; // Nếu chưa đăng nhập, chuyển hướng về Login
};

export default PrivateRoute;
