import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
  backdropFilter: 'blur(10px)',
}));

const LogoImage = styled('img')({
  height: '40px', // Adjust size as needed
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const HomeNavbar = () => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'center', height: '70px' }}>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <LogoImage 
            src="/assets/nexoraz-logo.png" // Update with your logo path
            alt="Nexora Logo"
          />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default HomeNavbar; 