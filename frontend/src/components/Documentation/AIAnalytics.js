import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaSearch, FaRobot } from 'react-icons/fa';
import styled from '@emotion/styled';

const StyledPaper = styled(Paper)`
  background: rgba(17, 34, 64, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FeatureBox = styled(Box)`
  border-left: 3px solid #64ffda;
  padding-left: 1rem;
  margin: 1rem 0;
`;

const AIAnalytics = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
      py: 12 
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              color: '#64ffda',
              mb: 4,
              fontWeight: 700,
              textAlign: 'center' 
            }}
          >
            AI-Powered Analytics
          </Typography>

          <StyledPaper elevation={4}>
            <Typography variant="h5" sx={{ color: '#ccd6f6', mb: 3 }}>
              Overview
            </Typography>
            <Typography sx={{ color: '#8892b0', mb: 4, lineHeight: 1.8 }}>
              Our AI-powered analytics system provides deep insights into your knowledge graphs. 
              Using advanced machine learning algorithms, it helps you discover patterns, 
              relationships, and hidden knowledge within your data.
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaBrain size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Pattern Recognition
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Identify complex patterns and relationships.
                  </Typography>
                </FeatureBox>
              </Grid>

              <Grid item xs={12} md={3}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaChartLine size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Predictive Analytics
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Forecast trends and future connections.
                  </Typography>
                </FeatureBox>
              </Grid>

              <Grid item xs={12} md={3}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaSearch size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Semantic Search
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Advanced search with natural language.
                  </Typography>
                </FeatureBox>
              </Grid>

              <Grid item xs={12} md={3}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaRobot size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Automated Insights
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    AI-generated recommendations and insights.
                  </Typography>
                </FeatureBox>
              </Grid>
            </Grid>
          </StyledPaper>

          <StyledPaper elevation={4}>
            <Typography variant="h5" sx={{ color: '#ccd6f6', mb: 3 }}>
              AI Capabilities
            </Typography>
            <Box component="ul" sx={{ color: '#8892b0', pl: 3 }}>
              {[
                'Graph pattern recognition',
                'Anomaly detection',
                'Relationship prediction',
                'Natural language processing',
                'Automated graph enrichment',
                'Knowledge inference',
                'Semantic analysis',
                'Custom AI model integration'
              ].map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ marginBottom: '1rem' }}
                >
                  {feature}
                </motion.li>
              ))}
            </Box>
          </StyledPaper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AIAnalytics;