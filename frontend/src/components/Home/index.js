import { IoIosArrowUp } from 'react-icons/io';
import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { FaDatabase, FaProjectDiagram, FaBrain, FaRocket, FaUsers, FaChartLine } from 'react-icons/fa';
import HomeNavbar from '../Layout/HomeNavbar';
import ShinyText from './ShinyText';

// Styled Components
const DarkBackground = styled(Box)`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(2,0,36,0) 0%, rgba(0,212,255,0.05) 100%);
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const GlassCard = styled(motion.div)`
  background: rgba(17, 34, 64, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 4rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
`;

const AnimatedButton = styled(motion(Button))`
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border-radius: 50px;
  text-transform: none;
  font-weight: 500;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-5px);
    border-color: #64ffda;
    cursor: pointer;
  }
`;

const FloatingParticle = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${props => props.color};
  border-radius: 50%;
  filter: blur(2px);
`;

const ScrollToTopButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(100, 255, 218, 0.1);
  border: 2px solid #64ffda;
  color: #64ffda;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    transform: translateY(-5px);
  }
`;

// Main Component
const Home = () => {
  const navigate = useNavigate(); // Add this hook
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const features = [
    {
      title: 'Interactive Visualization',
      description: 'Create and explore dynamic knowledge graphs with intuitive controls',
      icon: <FaProjectDiagram size={40} />,
      path: '/docs/visualization'
    },
    {
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time on shared graphs',
      icon: <FaUsers size={40} />,
      path: '/docs/collaboration'
    },
    {
      title: 'AI-Powered Analytics',
      description: 'Gain insights with advanced AI-driven graph analytics',
      icon: <FaBrain size={40} />,
      path: '/docs/analytics'
    }
  ];

  const additionalFeatures = [
    {
      title: 'Fast Performance',
      description: 'Lightning-fast graph rendering and interactions',
      icon: <FaRocket size={40} />,
    },
    {
      title: 'Data Integration',
      description: 'Seamlessly integrate with various data sources',
      icon: <FaDatabase size={40} />,
    },
    {
      title: 'Advanced Analytics',
      description: 'Powerful tools for data analysis and visualization',
      icon: <FaChartLine size={40} />,
    }
  ];

  return (
    <>
      <HomeNavbar />
      <DarkBackground>
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <FloatingParticle
            key={i}
            color={`hsl(${Math.random() * 360}, 50%, 50%)`}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ py: 8 }}>
            <GlassCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    color: '#64ffda',
                    fontWeight: 800,
                    textAlign: 'center',
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    textShadow: '0 0 20px rgba(100, 255, 218, 0.3)',
                    letterSpacing: '-1px'
                  }}
                >
                  <ShinyText text="NEXORAZ" speed={3} />
                </Typography>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: '#8892b0',
                    fontWeight: 600,
                    textAlign: 'center',
                    mb: 6,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  Visualize Your Knowledge Universe
                </Typography>
              </motion.div>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 8 }}>
                <AnimatedButton
                  variant="contained"
                  onClick={handleGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    background: 'linear-gradient(45deg, #64ffda 10%, #00bcd4 90%)',
                    color: '#0a192f',
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(100, 255, 218, 0.25)',
                  }}
                >
                  Get Started
                </AnimatedButton>

                <AnimatedButton
                  variant="outlined"
                  onClick={handleLearnMore}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    color: '#64ffda',
                    borderColor: '#64ffda',
                    '&:hover': {
                      borderColor: '#64ffda',
                      background: 'rgba(100, 255, 218, 0.1)',
                    },
                  }}
                >
                  Learn More
                </AnimatedButton>
              </Box>

              <div id="features-section">
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#ccd6f6',
                    textAlign: 'center',
                    mb: 6,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 600
                  }}
                >
                  Core Features
                </Typography>

                <Grid container spacing={4} sx={{ mb: 8 }}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: feature.delay, duration: 0.8 }}
                      >
                        <FeatureCard
                        onClick={() => navigate(feature.path)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                          <Box sx={{ color: '#64ffda', mb: 2, textAlign: 'center' }}>
                            {feature.icon}
                          </Box>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              color: '#ccd6f6',
                              mb: 2,
                              textAlign: 'center',
                              fontWeight: 600
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            sx={{ 
                              color: '#8892b0',
                              textAlign: 'center',
                              lineHeight: 1.6
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </FeatureCard>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#ccd6f6',
                    textAlign: 'center',
                    mb: 6,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 600
                  }}
                >
                  Additional Features
                </Typography>

                <Grid container spacing={4}>
                  {additionalFeatures.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: feature.delay, duration: 0.8 }}
                      >
                        <FeatureCard
                           onClick={() => navigate(feature.path)} // Direct navigation instead of handleFeatureClick
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                        >
                          <Box sx={{ color: '#64ffda', mb: 2, textAlign: 'center' }}>
                            {feature.icon}
                          </Box>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              color: '#ccd6f6',
                              mb: 2,
                              textAlign: 'center',
                              fontWeight: 600
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            sx={{ 
                              color: '#8892b0',
                              textAlign: 'center',
                              lineHeight: 1.6
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </FeatureCard>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </GlassCard>
          </Box>
        </Container>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollButton && (
            <ScrollToTopButton
              onClick={handleScrollToTop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IoIosArrowUp size={25} />
            </ScrollToTopButton>
          )}
        </AnimatePresence>
      </DarkBackground>
    </>
  );
};

export default Home;