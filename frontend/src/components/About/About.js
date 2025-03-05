import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Diversity3 as Diversity3Icon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Code as CodeIcon,
  CloudQueue as CloudIcon,
} from '@mui/icons-material';

const teamMembers = [
  {
    name: 'Rohit Prajapat',
    role: 'Founder & Lead Developer',
    image: '/team/rohit.jpg',
    description: 'Full-stack developer passionate about building scalable applications and integrating cutting-edge AI technologies. Specializes in knowledge graph visualization and distributed systems.',
    skills: ['React', 'Node.js', 'MongoDB', 'AI/ML', 'System Architecture', 'GraphQL'],
    achievements: ['Led development of core platform', 'Implemented AI integration', 'Designed system architecture'],
    linkedin: 'https://linkedin.com/in/rohit-prajapat-878bb2255/',
    github: 'https://github.com/rohit98626',
    education: 'B.Tech in Computer Science with Specialization in AI'
  },
  {
    name: 'Ankit Singh',
    role: 'Co-Founder & Lead Designer',
    image: '/team/ankit.png',
    description: 'Creative technologist with expertise in UI/UX design and frontend development. Passionate about creating intuitive user experiences and beautiful, responsive interfaces.',
    skills: ['UI/UX Design', 'React', 'Frontend Architecture', 'Design Systems', 'Responsive Design', 'Animation'],
    achievements: ['Designed core user interface', 'Created design system', 'Improved user experience'],
    linkedin: 'https://linkedin.com/in/ankit101104',
    github: 'https://github.com/Ankit101104',
    education: 'B.Tech in Computer Science with Specialization in AI'
  }
];

const milestones = [
  {
    year: 'December 2024',
    title: 'Project Inception',
    description: 'NEXORAZ was founded with the vision of revolutionizing knowledge management through AI-powered graph visualization.',
    icon: <LightbulbIcon />
  },
  {
    year: 'January 2025',
    title: 'Beta Launch',
    description: 'Successfully launched the beta version with core features including dynamic graph creation and real-time collaboration.',
    icon: <CodeIcon />
  },
  {
    year: 'February 2025',
    title: 'AI Integration',
    description: 'Integrated Google Gemini AI for advanced graph analysis, automated insights, and intelligent suggestions.',
    icon: <PsychologyIcon />
  },
  {
    year: 'March 2025',
    title: 'Premium Features',
    description: 'Introduced premium features including unlimited graphs, advanced analytics, and API access.',
    icon: <TrendingUpIcon />
  }
];

const AboutCard = ({ icon, title, content }) => (
  <Card
    component={motion.div}
    whileHover={{ y: -5 }}
    sx={{
      height: '100%',
      bgcolor: '#112240',
      border: '1px solid #233554',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#64ffda',
        boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
      },
    }}
  >
    <CardContent>
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Box
          sx={{
            color: '#64ffda',
            bgcolor: 'rgba(100, 255, 218, 0.1)',
            p: 2,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="#ccd6f6">
          {title}
        </Typography>
        <Typography color="#8892b0">
          {content}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const About = () => {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: '#64ffda',
            }}
          >
            About Us
          </Typography>

          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 6,
              color: '#8892b0',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Empowering knowledge discovery through innovative graph visualization and AI
          </Typography>

          {/* Mission and Values */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: '#112240',
                  border: '1px solid #233554',
                  height: '100%',
                  p: 3
                }}
              >
                <Typography variant="h4" color="#64ffda" gutterBottom>
                  Our Mission
                </Typography>
                <Typography color="#8892b0" paragraph>
                  At NEXORAZ, we're dedicated to transforming how people visualize and understand complex information. 
                  Our dynamic knowledge graph platform empowers users to create, analyze, and share knowledge in 
                  innovative ways, making complex information accessible and actionable.
                </Typography>
                <Typography color="#8892b0">
                  We believe in the power of visual learning and collaborative knowledge sharing to drive understanding
                  and innovation across all fields of study and industry.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: '#112240',
                  border: '1px solid #233554',
                  height: '100%',
                  p: 3
                }}
              >
                <Typography variant="h4" color="#64ffda" gutterBottom>
                  Our Vision
                </Typography>
                <Typography color="#8892b0" paragraph>
                  We envision a future where knowledge sharing transcends traditional boundaries, where AI and human 
                  intelligence work in harmony to create deeper understanding and meaningful connections.
                </Typography>
                <Typography color="#8892b0">
                  Our platform serves as a bridge between complex data and human understanding, making knowledge
                  accessible, interactive, and engaging for everyone.
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Core Values */}
          <Typography variant="h4" color="#ccd6f6" align="center" sx={{ mb: 4 }}>
            Core Values
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {[
              {
                icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
                title: 'Innovation',
                content: 'Pushing boundaries in knowledge visualization and AI integration',
              },
              {
                icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
                title: 'Intelligence',
                content: 'Leveraging cutting-edge AI to enhance human understanding',
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 40 }} />,
                title: 'Security',
                content: 'Ensuring data protection and user privacy',
              },
              {
                icon: <SpeedIcon sx={{ fontSize: 40 }} />,
                title: 'Performance',
                content: 'Delivering fast and responsive experiences',
              },
              {
                icon: <Diversity3Icon sx={{ fontSize: 40 }} />,
                title: 'Collaboration',
                content: 'Fostering a community of knowledge sharing and growth',
              },
              {
                icon: <CloudIcon sx={{ fontSize: 40 }} />,
                title: 'Scalability',
                content: 'Building for growth and future expansion',
              },
            ].map((value, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AboutCard {...value} />
              </Grid>
            ))}
          </Grid>

          {/* Team Section */}
          <Typography variant="h4" color="#ccd6f6" align="center" sx={{ mb: 4 }}>
            Our Team
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8, justifyContent: 'center' }}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={5} key={index}>
                <Card
                  component={motion.div}
                  whileHover={{ y: -5 }}
                  sx={{
                    bgcolor: '#112240',
                    border: '1px solid #233554',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      borderColor: '#64ffda',
                      boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3} alignItems="center" textAlign="center">
                      <Avatar
                        src={member.image}
                        sx={{ 
                          width: 140, 
                          height: 140, 
                          mb: 2,
                          border: '3px solid #64ffda'
                        }}
                      />
                      <Box>
                        <Typography variant="h5" color="#ccd6f6" gutterBottom>
                          {member.name}
                        </Typography>
                        <Typography 
                          color="#64ffda" 
                          sx={{ 
                            fontWeight: 500,
                            fontSize: '1.1rem'
                          }}
                        >
                          {member.role}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#8892b0"
                          sx={{
                            mt: 0.5,
                            fontStyle: 'italic'
                          }}
                        >
                          {member.education}
                        </Typography>
                      </Box>
                      <Typography 
                        color="#8892b0" 
                        sx={{ 
                          fontSize: '1rem',
                          lineHeight: 1.6,
                          maxWidth: '90%'
                        }}
                      >
                        {member.description}
                      </Typography>
                      <Box>
                        <Typography 
                          color="#ccd6f6" 
                          sx={{ 
                            mb: 2,
                            fontSize: '0.9rem',
                            fontWeight: 500
                          }}
                        >
                          Key Achievements
                        </Typography>
                        <Stack spacing={1} sx={{ mb: 3 }}>
                          {member.achievements.map((achievement, idx) => (
                            <Typography
                              key={idx}
                              color="#8892b0"
                              sx={{
                                fontSize: '0.9rem',
                                lineHeight: 1.4
                              }}
                            >
                              • {achievement}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                      <Box>
                        <Typography 
                          color="#ccd6f6" 
                          sx={{ 
                            mb: 2,
                            fontSize: '0.9rem',
                            fontWeight: 500
                          }}
                        >
                          Skills & Expertise
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                          {member.skills.map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(100, 255, 218, 0.1)',
                                color: '#64ffda',
                                border: '1px solid rgba(100, 255, 218, 0.2)',
                                fontSize: '0.9rem',
                                py: 0.5
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <motion.a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          style={{
                            color: '#64ffda',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          LinkedIn
                        </motion.a>
                        <motion.a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          style={{
                            color: '#64ffda',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          GitHub
                        </motion.a>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Timeline */}
          <Typography variant="h4" color="#ccd6f6" align="center" sx={{ mb: 4 }}>
            Our Journey
          </Typography>
          <Timeline position="alternate">
            {milestones.map((milestone, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot 
                    sx={{ 
                      bgcolor: '#64ffda',
                      p: 1
                    }}
                  >
                    {milestone.icon}
                  </TimelineDot>
                  {index < milestones.length - 1 && (
                    <TimelineConnector sx={{ bgcolor: '#64ffda' }} />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -5 }}
                    sx={{
                      bgcolor: '#112240',
                      border: '1px solid #233554',
                      p: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#64ffda',
                        boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
                      },
                    }}
                  >
                    <Typography variant="h6" color="#64ffda">
                      {milestone.year}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="#ccd6f6"
                      sx={{ 
                        fontWeight: 600,
                        my: 1
                      }}
                    >
                      {milestone.title}
                    </Typography>
                    <Typography color="#8892b0">
                      {milestone.description}
                    </Typography>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About; 