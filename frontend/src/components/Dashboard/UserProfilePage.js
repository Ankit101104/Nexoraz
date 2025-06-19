import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { updateUserProfile, fetchUserProfile } from '../../redux/slices/authSlice';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  console.log('Current user in Redux:', user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: '#0a192f',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress sx={{ color: '#64ffda' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#0a192f',
      p: 3
    }}>
      <Box sx={{ 
        maxWidth: 800, 
        margin: 'auto',
        mt: 4 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          gap: 2
        }}>
          <IconButton 
            onClick={() => navigate('/dashboard')}
            sx={{ color: '#64ffda' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" color="#64ffda">
            Profile Settings
          </Typography>
        </Box>

        <Paper sx={{ 
          p: 4, 
          bgcolor: '#112240',
          borderRadius: 2,
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4
          }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80,
                bgcolor: '#64ffda',
                color: '#0a192f'
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" color="#ffffff">
                {formData.username}
              </Typography>
              <Typography color="#8892b0">
                {formData.email}
              </Typography>
            </Box>
            <IconButton 
              sx={{ ml: 'auto', color: '#64ffda' }}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <CancelIcon /> : <EditIcon />}
            </IconButton>
          </Box>

          {(error || success) && (
            <Alert 
              severity={error ? "error" : "success"} 
              sx={{ mb: 3 }}
            >
              {error || success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': { borderColor: '#64ffda' },
                    '&:hover fieldset': { borderColor: '#64ffda' },
                  },
                  '& .MuiInputLabel-root': { color: '#8892b0' }
                }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': { borderColor: '#64ffda' },
                    '&:hover fieldset': { borderColor: '#64ffda' },
                  },
                  '& .MuiInputLabel-root': { color: '#8892b0' }
                }}
              />

              {isEditing && (
                <>
                  <Divider sx={{ borderColor: '#1d4ed8', my: 2 }} />
                  
                  <Typography variant="h6" color="#64ffda" gutterBottom>
                    Change Password
                  </Typography>

                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#64ffda' },
                        '&:hover fieldset': { borderColor: '#64ffda' },
                      },
                      '& .MuiInputLabel-root': { color: '#8892b0' }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#64ffda' },
                        '&:hover fieldset': { borderColor: '#64ffda' },
                      },
                      '& .MuiInputLabel-root': { color: '#8892b0' }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#64ffda' },
                        '&:hover fieldset': { borderColor: '#64ffda' },
                      },
                      '& .MuiInputLabel-root': { color: '#8892b0' }
                    }}
                  />
                </>
              )}

              {isEditing && (
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    bgcolor: '#64ffda',
                    color: '#0a192f',
                    '&:hover': { bgcolor: '#4caf50' }
                  }}
                >
                  Save Changes
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserProfilePage; 