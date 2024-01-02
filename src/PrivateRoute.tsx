// src/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuth } from './AuthContext';

type PrivateRouteProps = {
    children: React.ReactNode;
  };

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const location = useLocation();
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      // Redirect them to the sign-in page, but save the current location they were trying to go to
      return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (!user.emailVerified) {
      // Redirect to a specific page or show a message if the user's email is not verified
      // For example, redirecting to a 'verify-email' page
      // return <Navigate to="/verify-email" state={{ from: location }} replace />;
      // Or showing a message
      return <div>Please verify your email to access this page.</div>;
    }
  
    return <>{children}</>;
  };

export default PrivateRoute;
