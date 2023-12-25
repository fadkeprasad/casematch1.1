// src/PrivateRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

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
  
    return <>{children}</>;
  };

export default PrivateRoute;
