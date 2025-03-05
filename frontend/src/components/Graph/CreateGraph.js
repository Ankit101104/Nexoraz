import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createGraph } from '../../redux/slices/graphSlice';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const CreateGraph = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [graphData, setGraphData] = useState({
    title: '',
    description: '',
    type: 'concept',
    nodes: [],
    edges: []
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGraphData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateGraph = async () => {
    try {
<<<<<<< HEAD
      // First, generate detailed graph data
      const graphData = await generateDetailedGraph(graphData.title, graphData.description);

      // Then create the graph with the generated data
      const response = await fetch('http://localhost:5000/api/graphs', {
=======
      if (!graphData.title || !graphData.description) {
        setError('Both title and description are required');
        return;
      }

      // Generate graph data using both title and description
      const response = await fetch('http://localhost:5000/api/generate-graph-data', {
>>>>>>> 17e6718 (initial commit)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: graphData.title,
          description: graphData.description,
<<<<<<< HEAD
          type: graphData.type || 'concept',
          nodes: graphData.nodes,
          edges: graphData.edges
=======
          type: graphData.type,
          settings: {
            maxNodes: 12,
            maxEdges: 15,
            mainNode: graphData.title,
            context: graphData.description,
            graphType: graphData.type
          }
>>>>>>> 17e6718 (initial commit)
        })
      });

      const data = await response.json();

      if (response.status === 403 && data.limit_reached) {
        alert(data.message);
        navigate('/pricing');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create graph');
      }

      // Dispatch to Redux store
      dispatch(createGraph(data));
      
      // Navigate to the new graph
      navigate(`/graph/${data._id}`);

    } catch (error) {
      console.error('Error creating graph:', error);
      setError(error.message);
    }
  };

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: 600,
      mx: 'auto',
      mt: 4
    }}>
      <Paper sx={{ 
        p: 3,
        bgcolor: '#112240',
        border: '1px solid rgba(100, 255, 218, 0.1)'
      }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#64ffda' }}>
          Create New Graph
        </Typography>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="title"
            label="Graph Title"
            value={graphData.title}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#64ffda' },
                '&:hover fieldset': { borderColor: '#64ffda' },
              },
              '& .MuiInputLabel-root': { color: '#64ffda' }
            }}
          />

          <TextField
            name="description"
            label="Description"
            value={graphData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#64ffda' },
                '&:hover fieldset': { borderColor: '#64ffda' },
              },
              '& .MuiInputLabel-root': { color: '#64ffda' }
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ color: '#64ffda' }}>Graph Type</InputLabel>
            <Select
              name="type"
              value={graphData.type}
              onChange={handleInputChange}
              sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#64ffda' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#64ffda' },
              }}
            >
              <MenuItem value="concept">Concept Map</MenuItem>
              <MenuItem value="process">Process Flow</MenuItem>
              <MenuItem value="system">System Architecture</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleCreateGraph}
            sx={{
              bgcolor: '#64ffda',
              color: '#0a192f',
              '&:hover': { bgcolor: '#4caf50' }
            }}
          >
            Create Graph
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateGraph; 