import React from 'react';
import { Navigate } from 'react-router-dom';
import { User } from 'firebase/auth';

interface PrivateRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ user, children }) => {
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;