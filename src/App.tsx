// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import HomePage from './HomePage';
import UserProfile from './UserProfile';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';
// ... any other imports

const App: React.FC = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/userprofile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        {/* ... other routes */}
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
