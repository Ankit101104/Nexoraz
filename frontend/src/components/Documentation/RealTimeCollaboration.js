import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { FaUsers, FaComments, FaHistory, FaLock } from 'react-icons/fa';
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

const RealTimeCollaboration = () => {
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
            Real-time Collaboration
          </Typography>

          <StyledPaper elevation={4}>
            <Typography variant="h5" sx={{ color: '#ccd6f6', mb: 3 }}>
              Overview
            </Typography>
            <Typography sx={{ color: '#8892b0', mb: 4, lineHeight: 1.8 }}>
              Our real-time collaboration feature enables multiple users to work simultaneously on the same knowledge graph. 
              Changes are synchronized instantly across all connected users, making team collaboration seamless and efficient.
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaUsers size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Multi-user Editing
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Multiple users can edit the graph simultaneously.
                  </Typography>
                </FeatureBox>
              </Grid>

              <Grid item xs={12} md={3}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaComments size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Real-time Chat
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Built-in chat system for team communication.
                  </Typography>
                </FeatureBox>
              </Grid>

              <Grid item xs={12} md={3}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaHistory size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Version History
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Track changes and revert when needed.
                  </Typography>
                </FeatureBox>
              </Grid>

              <Grid item xs={12} md={3}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaLock size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Access Control
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Manage user permissions and roles.
                  </Typography>
                </FeatureBox>
              </Grid>
            </Grid>
          </StyledPaper>

          <StyledPaper elevation={4}>
            <Typography variant="h5" sx={{ color: '#ccd6f6', mb: 3 }}>
              Collaboration Features
            </Typography>
            <Box component="ul" sx={{ color: '#8892b0', pl: 3 }}>
              {[
                'Real-time synchronization of changes',
                'Presence indicators showing active users',
                'Integrated chat system',
                'Conflict resolution',
                'Change history and versioning',
                'User permissions and roles',
                'Shared annotations and comments',
                'Export and sharing options'
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

export default RealTimeCollaboration;