import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { FaProjectDiagram, FaMousePointer, FaExpandArrowsAlt } from 'react-icons/fa';
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

const InteractiveVisualization = () => {
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
            Interactive Visualization
          </Typography>

          <StyledPaper elevation={4}>
            <Typography variant="h5" sx={{ color: '#ccd6f6', mb: 3 }}>
              Overview
            </Typography>
            <Typography sx={{ color: '#8892b0', mb: 4, lineHeight: 1.8 }}>
              Our interactive visualization system allows users to create, manipulate, and explore knowledge graphs in real-time. 
              Built with cutting-edge technology, it provides an intuitive interface for working with complex data structures.
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaProjectDiagram size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Dynamic Graph Creation
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Create nodes and edges with simple clicks and drags. Customize properties on the fly.
                  </Typography>
                </FeatureBox>
              </Grid>

              <Grid item xs={12} md={4}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaMousePointer size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Intuitive Controls
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Pan, zoom, and navigate through your knowledge graph with ease.
                  </Typography>
                </FeatureBox>
              </Grid>

              <Grid item xs={12} md={4}>
                <FeatureBox>
                  <Box sx={{ color: '#64ffda', mb: 2 }}>
                    <FaExpandArrowsAlt size={30} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ccd6f6', mb: 1 }}>
                    Layout Options
                  </Typography>
                  <Typography sx={{ color: '#8892b0' }}>
                    Multiple automatic layout algorithms to organize your graph optimally.
                  </Typography>
                </FeatureBox>
              </Grid>
            </Grid>
          </StyledPaper>

          <StyledPaper elevation={4}>
            <Typography variant="h5" sx={{ color: '#ccd6f6', mb: 3 }}>
              Key Features
            </Typography>
            <Box component="ul" sx={{ color: '#8892b0', pl: 3 }}>
              {[
                'Drag-and-drop node creation',
                'Real-time edge connections',
                'Custom node styling',
                'Multiple layout algorithms',
                'Zoom and pan controls',
                'Search and highlight functionality',
                'Property editing',
                'Undo/Redo support'
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

          <StyledPaper elevation={4}>
            <Typography variant="h5" sx={{ color: '#ccd6f6', mb: 3 }}>
              Usage Guide
            </Typography>
            <Box sx={{ color: '#8892b0' }}>
              <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
                1. <strong style={{ color: '#64ffda' }}>Creating Nodes:</strong> Double-click on the canvas to create a new node. 
                Drag nodes to reposition them.
              </Typography>
              <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
                2. <strong style={{ color: '#64ffda' }}>Creating Edges:</strong> Click and drag from one node to another to create 
                a connection.
              </Typography>
              <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
                3. <strong style={{ color: '#64ffda' }}>Editing Properties:</strong> Right-click on nodes or edges to edit their 
                properties.
              </Typography>
              <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
                4. <strong style={{ color: '#64ffda' }}>Navigation:</strong> Use mouse wheel to zoom, drag empty space to pan.
              </Typography>
            </Box>
          </StyledPaper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default InteractiveVisualization;