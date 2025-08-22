import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import AboutUs from "./About/AboutUs";
import Home from "./home-page/Home";
import GoToTop from "./go-to-top/GoToTop";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LostUpload from './lost-details-upload-page/LostUpload';
import FoundUpload from './found-item-details-page/FoundUpload';
import Login from "./login-page/Login";
import ProtectedRoute from './ProtectedRoute';
import Footer from "../src/Footer/Footer";
import Confirm from './confirmation_page/Confirm';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
  const [theme, setTheme] = useState('light');
  const [showConfirmPage, setShowConfirmPage] = useState(false);
  const { logout } = useAuth();

  const toggleTheme = (theme) => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    console.log(theme);
  };

  const showConfirm = (value) => {
    setShowConfirmPage(value);
  };

  return (
    <Router>
      {showConfirmPage ?
        <Confirm func={showConfirm} /> :
        (<>
          <Navbar toggleTheme={toggleTheme} theme={theme} />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login theme={theme} />} />
            {/* Non-protected routes */}
            <Route path="/about" element={<AboutUs theme={theme} />} />
            <Route path="/faq" element={<Faq theme={theme} />} />


            {/* Protected routes */}
            <Route path="/home" element={<ProtectedRoute><Home theme={theme} /></ProtectedRoute>} />
            <Route path="/lost" element={<ProtectedRoute><LostUpload theme={theme} /></ProtectedRoute>} />
            <Route path="/found" element={<ProtectedRoute><FoundUpload theme={theme} /></ProtectedRoute>} />
     

            {/* Sign-out route */}
            <Route path="/signout" element={<SignOut logout={logout} />} />
          </Routes>
          <GoToTop />
          <Footer />
        </>)}
    </Router>
  );
};

// Sign-out component to handle sign-out process
const SignOut = ({ logout }) => {
  React.useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1>Signing Out...</h1>
      <p>Please wait while we sign you out.</p>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
