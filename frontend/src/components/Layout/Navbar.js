import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Container, IconButton, Tooltip } from '@mui/material';
import { motion, useScroll } from 'framer-motion';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useAuth } from '../../contexts/AuthContext';

// Add neon glow animation
const neonGlow = keyframes`
  0% {
    border-color: rgba(100, 255, 218, 0.2);
    box-shadow: 0 0 5px rgba(100, 255, 218, 0.2),
                0 0 10px rgba(100, 255, 218, 0.2),
                0 0 15px rgba(100, 255, 218, 0.2);
  }
  50% {
    border-color: rgba(100, 255, 218, 0.8);
    box-shadow: 0 0 20px rgba(100, 255, 218, 0.4),
                0 0 35px rgba(100, 255, 218, 0.4),
                0 0 45px rgba(100, 255, 218, 0.4);
  }
  100% {
    border-color: rgba(100, 255, 218, 0.2);
    box-shadow: 0 0 5px rgba(100, 255, 218, 0.2),
                0 0 10px rgba(100, 255, 218, 0.2),
                0 0 15px rgba(100, 255, 218, 0.2);
  }
`;

const StyledAppBar = styled(motion(AppBar))`
  background: rgba(10, 25, 47, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(100, 255, 218, 0.3);
  animation: ${neonGlow} 3s ease-in-out infinite;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(100, 255, 218, 0) 0%,
      rgba(100, 255, 218, 0.8) 50%,
      rgba(100, 255, 218, 0) 100%
    );
    animation: ${neonGlow} 3s ease-in-out infinite;
  }
`;

const NavButton = styled(Button)`
  color: #64ffda;
  margin: 0 1rem;
  font-size: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #64ffda;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #64ffda;
  cursor: pointer;
`;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    return scrollY.onChange(() => setIsScrolled(scrollY.get() > 50));
  }, [scrollY]);

  const navItems = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Features', path: '/features' },
    { name: 'Updates', path: '/updates' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate('/');
    });
  };

  return (
    <StyledAppBar
      position="fixed"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={isScrolled ? 24 : 0}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Logo
            whileTap={{ scale: 0.95 }}
            component={Link}
            to="/"
          >
            NEXORAZ
          </Logo>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {navItems.map((item) => (
              <NavButton
                key={item.name}
                component={motion.button}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </NavButton>
            ))}

            {/* Profile and Logout Buttons */}
            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              <Tooltip title="Profile Settings">
                <IconButton
                  onClick={() => navigate('/profile')}
                  sx={{ 
                    color: '#64ffda',
                    '&:hover': { 
                      bgcolor: 'rgba(100, 255, 218, 0.1)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Logout">
                <IconButton
                  onClick={handleLogout}
                  sx={{ 
                    color: '#ef4444',
                    '&:hover': { 
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {user && (
              <NavButton
                component={motion.button}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => navigate('/pricing')}
              >
                {user.isPremium ? 'Premium Member' : 'Upgrade to Premium'}
              </NavButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;