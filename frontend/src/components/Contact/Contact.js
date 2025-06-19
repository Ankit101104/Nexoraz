import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ContactCard = ({ icon, title, content, link }) => (
  <Card
    component={motion.div}
    whileHover={{ y: -5 }}
    sx={{
      bgcolor: '#112240',
      height: '100%',
      border: '1px solid #233554',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#64ffda',
        boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
      },
    }}
  >
    <CardContent sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      textAlign: 'center',
      gap: 2 
    }}>
      <Box sx={{ 
        color: '#64ffda',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: '50%',
        bgcolor: 'rgba(100, 255, 218, 0.1)',
        mb: 2
      }}>
        {icon}
      </Box>
      <Typography variant="h6" color="#ccd6f6" gutterBottom>
        {title}
      </Typography>
      <Typography color="#8892b0">
        {content}
      </Typography>
      {link && (
        <Button 
          href={link} 
          target="_blank"
          sx={{ 
            color: '#64ffda',
            '&:hover': { color: '#4caf50' }
          }}
        >
          Visit
        </Button>
      )}
    </CardContent>
  </Card>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
    setSnackbar({
      open: true,
      message: 'Message sent successfully!',
      severity: 'success'
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 32 }} />,
      title: 'Email',
      content: 'contact@nexoraz.com',
      link: 'mailto:contact@nexoraz.com'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 32 }} />,
      title: 'Phone',
      content: '+91 7357707100'
    },
    {
      icon: <LocationIcon sx={{ fontSize: 32 }} />,
      title: 'Location',
      content: 'Vadodara, Gujarat 390019'
    }
  ];

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
            mb: 6,
            fontWeight: 'bold',
            color: '#64ffda',
          }}
        >
          Contact Us
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Info Cards */}
          {contactInfo.map((info, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ContactCard {...info} />
            </Grid>
          ))}

          {/* Contact Form */}
          <Grid item xs={12}>
            <Card
              component={motion.form}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{
                bgcolor: '#112240',
                p: 4,
                border: '1px solid #233554',
                '&:hover': {
                  borderColor: '#64ffda',
                  boxShadow: '0 0 20px rgba(100, 255, 218, 0.1)',
                },
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{
                      '& label': { color: '#8892b0' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#233554' },
                        '&:hover fieldset': { borderColor: '#64ffda' },
                        '&.Mui-focused fieldset': { borderColor: '#64ffda' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{
                      '& label': { color: '#8892b0' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#233554' },
                        '&:hover fieldset': { borderColor: '#64ffda' },
                        '&.Mui-focused fieldset': { borderColor: '#64ffda' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    sx={{
                      '& label': { color: '#8892b0' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#233554' },
                        '&:hover fieldset': { borderColor: '#64ffda' },
                        '&.Mui-focused fieldset': { borderColor: '#64ffda' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    sx={{
                      '& label': { color: '#8892b0' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#233554' },
                        '&:hover fieldset': { borderColor: '#64ffda' },
                        '&.Mui-focused fieldset': { borderColor: '#64ffda' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: '#64ffda',
                      color: '#0a192f',
                      '&:hover': {
                        bgcolor: '#4caf50',
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Contact; 