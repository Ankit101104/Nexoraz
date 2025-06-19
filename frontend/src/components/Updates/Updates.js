import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';

const Updates = () => {
  const plannedUpdates = [
    {
      title: 'Enhanced Graph Features',
      description: 'New templates, sharing options, and export capabilities',
      status: 'In Progress',
      progress: 60,
      features: [
        'Graph templates/presets',
        'Export to PDF/PNG',
        'Graph sharing',
        'Graph merging'
      ]
    },
    {
      title: 'AI Integration',
      description: 'Advanced AI-powered features for better graph creation and analysis',
      status: 'Planned',
      progress: 30,
      features: [
        'AI-powered graph generation',
        'Smart node linking',
        'Automated insights',
        'Natural language processing'
      ]
    },
    {
      title: 'Collaboration Features',
      description: 'Real-time collaboration and team features',
      status: 'Coming Soon',
      progress: 45,
      features: [
        'Real-time editing',
        'Comments and discussions',
        'Team workspaces',
        'Version history'
      ]
    },
    {
      title: 'Advanced Analytics',
      description: 'Deep insights and analytics for your knowledge graphs',
      status: 'Planned',
      progress: 20,
      features: [
        'Graph analytics',
        'Usage statistics',
        'Performance metrics',
        'Custom reports'
      ]
    }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#0a192f', minHeight: '100vh' }}>
      <Typography variant="h4" color="#64ffda" sx={{ mb: 4 }}>
        Future Updates
      </Typography>
      
      <Grid container spacing={3}>
        {plannedUpdates.map((update, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ 
              bgcolor: '#112240',
              color: '#ffffff',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="#64ffda">
                    {update.title}
                  </Typography>
                  <Chip 
                    label={update.status}
                    size="small"
                    sx={{ 
                      bgcolor: update.status === 'In Progress' ? '#1d4ed8' : 
                             update.status === 'Coming Soon' ? '#047857' : '#374151',
                      color: '#ffffff'
                    }}
                  />
                </Box>
                
                <Typography color="#8892b0" sx={{ mb: 2 }}>
                  {update.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={update.progress}
                    sx={{
                      bgcolor: 'rgba(100, 255, 218, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#64ffda'
                      }
                    }}
                  />
                  <Typography variant="caption" color="#8892b0" sx={{ mt: 0.5, display: 'block' }}>
                    {update.progress}% Complete
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {update.features.map((feature, idx) => (
                    <Chip 
                      key={idx}
                      label={feature}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(100, 255, 218, 0.1)',
                        color: '#64ffda',
                        '&:hover': { bgcolor: 'rgba(100, 255, 218, 0.2)' }
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Updates; 