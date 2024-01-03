// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import HomePage from './HomePage';
import UserProfile from './UserProfile';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';
import DataViewer from './DataViewer';
// ... any other imports <Router basename="https://fadkeprasad.github.io/casematch1.1/">

const App: React.FC = () => {
  return (
    <AuthProvider>
    <Router basename="/casematch1.1">
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
        <Route
            path="/dataviewer"
            element={
              <PrivateRoute>
                <DataViewer />
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
