import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  AccountTree as GraphIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Add as CreateIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const features = [
  {
    title: 'Knowledge Graph Creation',
    description: 'Create detailed knowledge graphs with nodes and edges to visualize complex relationships',
    icon: <GraphIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
    status: 'Available',
    details: [
      'Interactive graph interface',
      'Node and edge creation',
      'Custom graph titles and descriptions'
    ]
  },
  {
    title: 'Advanced Search & Filtering',
    description: 'Powerful search capabilities to find and filter your knowledge graphs',
    icon: <SearchIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
    status: 'Available',
    details: [
      'Full-text search',
      'Filter by graph type',
      'Sort by date, name, or nodes'
    ]
  },
  {
    title: 'Graph Management',
    description: 'Comprehensive tools to manage your knowledge graphs',
    icon: <EditIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
    status: 'Available',
    details: [
      'Edit existing graphs',
      'Delete graphs',
      'View graph statistics'
    ]
  },
  {
    title: 'Organization Features',
    description: 'Keep your graphs organized and easily accessible',
    icon: <FilterIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
    status: 'Available',
    details: [
      'Favorite graphs',
      'Graph categorization',
      'Creation date tracking'
    ]
  },
  {
    title: 'Graph Types',
    description: 'Different types of graphs for various use cases',
    icon: <SortIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
    status: 'Available',
    details: [
      'Concept graphs',
      'Process graphs',
      'System graphs'
    ]
  },
  {
    title: 'User Dashboard',
    description: 'Centralized dashboard to manage all your knowledge graphs',
    icon: <CreateIcon sx={{ fontSize: 40, color: '#64ffda' }} />,
    status: 'Available',
    details: [
      'Graph overview',
      'Quick actions',
      'Graph statistics'
    ]
  },
];

const Features = () => {
  return (
    <Box
      sx={{
        bgcolor: '#0a192f',
        color: '#ccd6f6',
        py: 8,
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: '#64ffda',
          }}
        >
          Features
        </Typography>
        
        <Typography
          variant="h6"
          align="center"
          sx={{
            mb: 6,
            color: '#8892b0',
          }}
        >
          Discover what NEXORAZ has to offer
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#112240',
                  border: '1px solid #233554',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(100, 255, 218, 0.1)',
                    border: '1px solid rgba(100, 255, 218, 0.2)',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                    <Chip 
                      label={feature.status}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(100, 255, 218, 0.1)',
                        color: '#64ffda',
                        border: '1px solid rgba(100, 255, 218, 0.2)'
                      }}
                    />
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    sx={{ 
                      color: '#ccd6f6',
                      mb: 2,
                      fontWeight: 600
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{ 
                      color: '#8892b0',
                      mb: 2
                    }}
                  >
                    {feature.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {feature.details.map((detail, idx) => (
                      <Chip
                        key={idx}
                        label={detail}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(100, 255, 218, 0.05)',
                          color: '#8892b0',
                          border: '1px solid rgba(100, 255, 218, 0.1)',
                          '&:hover': {
                            bgcolor: 'rgba(100, 255, 218, 0.1)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features; 