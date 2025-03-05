import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navbar from './components/Layout/Navbar';
import Home from './components/Home/index';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Layout/Footer';
import InteractiveVisualization from './components/Documentation/InteractiveVisualization';
import RealTimeCollaboration from './components/Documentation/RealTimeCollaboration';
import AIAnalytics from './components/Documentation/AIAnalytics';
import { Provider } from 'react-redux';
import store from './redux/store';
import Graph from './components/Graph/Graph';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import UserProfilePage from './components/Dashboard/UserProfilePage';
import HomeNavbar from './components/Layout/HomeNavbar';
import Features from './components/Features/Features';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import ChatBot from './components/ChatBot/ChatBot';
import Pricing from './components/Pricing/Pricing';
import { AuthProvider } from './contexts/AuthContext';
import Updates from './components/Updates/Updates';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64ffda',
    },
    secondary: {
      main: '#00bcd4',
    },
    background: {
      default: '#0a192f',
      paper: '#112240',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiModal: {
      defaultProps: {
        container: document.body,
        disablePortal: false,
        keepMounted: true
      },
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(10, 25, 47, 0.8)',
          }
        }
      }
    },
    MuiDialog: {
      defaultProps: {
        scroll: 'paper',
        maxWidth: 'sm',
        fullWidth: true
      }
    }
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');
  
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Create an AppContent component that uses Router hooks
const AppContent = () => {
  const location = useLocation();
  const showHomeNavbar = ["/", "/login", "/register", "/docs/visualization", "/docs/collaboration", "/docs/analytics"].includes(location.pathname);
  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const InteractiveVisualizationPage = location.pathname === "/docs/visualization";
  const RealTimeCollaborationPage = location.pathname === "/docs/collaboration";
  const AIAnalyticsPage = location.pathname === "/docs/analytics";

  return (
    <Box 
      component="main"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#0a192f'
      }}
    >
      {showHomeNavbar ? <HomeNavbar /> : <Navbar />}
      <Box sx={{ 
        flexGrow: 1,
        marginTop: '64px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/docs/visualization" element={<InteractiveVisualization />} />
          <Route path="/docs/collaboration" element={<RealTimeCollaboration />} />
          <Route path="/docs/analytics" element={<AIAnalytics />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/graph/:id" element={
            <ProtectedRoute>
              <Graph />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="*" element={<Box p={3}><Typography>Page not found</Typography></Box>} />
        </Routes>
      </Box> 
      <Footer />
      {!isHomePage && !isLoginPage && !isRegisterPage && !InteractiveVisualizationPage && !RealTimeCollaborationPage && !AIAnalyticsPage && <ChatBot />}
    </Box>
  );
};

// Main App component
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;