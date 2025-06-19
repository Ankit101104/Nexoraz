import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  CircularProgress,
  CardMedia,
  CardHeader,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGraphs, createGraph, deleteGraph } from '../../redux/slices/graphSlice';
import NewGraphDialog from './NewGraphDialog';
import { useAuth } from '../../contexts/AuthContext';
import { loadScript } from '../../utils/loadScript';

const Dashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { graphs: graphsData, loading, error } = useSelector((state) => state.graph);
  const graphs = Array.isArray(graphsData) ? graphsData : [];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [graphToDelete, setGraphToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchGraphs());
  }, [dispatch]);

  const filteredAndSortedGraphs = React.useMemo(() => {
    let result = [...graphs];

    if (searchTerm) {
      result = result.filter(graph => 
        graph.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        graph.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      result = result.filter(graph => graph.type === filterType);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.created_at || 0) - new Date(a.created_at || 0);
          break;
        case 'name':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'nodes':
          comparison = (b.nodes?.length || 0) - (a.nodes?.length || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison * -1 : comparison;
    });

    return result;
  }, [graphs, searchTerm, sortBy, sortOrder, filterType]);

  const handleCreateGraph = (graphData) => {
    dispatch(createGraph(graphData)).then(async (action) => {
      if (action.payload && !action.error) {
        const graphId = action.payload._id;
        navigate(`/graph/${graphId}`);
      } else {
        console.error('Error creating graph:', action.error);
      }
    });
    setDialogOpen(false);
  };

  const handleDeleteClick = (graph) => {
    setGraphToDelete(graph);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (graphToDelete) {
      await dispatch(deleteGraph(graphToDelete._id));
      setDeleteDialogOpen(false);
      setGraphToDelete(null);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const toggleFavorite = (graphId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(graphId)) {
        newFavorites.delete(graphId);
      } else {
        newFavorites.add(graphId);
      }
      return newFavorites;
    });
  };

  const getGraphTypeColor = (type) => {
    switch (type) {
      case 'concept': return '#00bcd4';
      case 'process': return '#4caf50';
      case 'system': return '#ff9800';
      default: return '#64ffda';
    }
  };

  const handlePremiumUpgrade = async () => {
    // Load Razorpay script
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your connection.');
      return;
    }

    try {
      // Create order on backend
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: 999, // Amount in paise (e.g., ₹999 = 99900 paise)
          currency: 'INR'
        })
      });

      const orderData = await response.json();
      
      if (orderData.error) {
        throw new Error(orderData.error);
      }

      // Initialize Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Knowledge Graph Premium',
        description: 'Upgrade to Premium Plan',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const data = await verifyResponse.json();
            
            if (data.success) {
              // Update local user state to reflect premium status
              alert('Successfully upgraded to premium!');
            }
          } catch (err) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#64ffda'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Unable to initiate payment. Please try again later.');
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#0a192f', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" color="#64ffda">
          My Knowledge Graphs
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            bgcolor: '#64ffda',
            color: '#0a192f',
            '&:hover': {
              bgcolor: '#4caf50'
            }
          }}
        >
          Create New Graph
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search graphs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64ffda' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              color: '#ffffff',
              '& fieldset': { borderColor: '#64ffda' },
              '&:hover fieldset': { borderColor: '#64ffda' },
            }
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Sort by">
            <Button
              startIcon={<SortIcon />}
              onClick={() => {
                const nextSortBy = sortBy === 'date' ? 'name' : 
                                 sortBy === 'name' ? 'nodes' : 'date';
                setSortBy(nextSortBy);
              }}
              sx={{ 
                color: '#64ffda', 
                borderColor: '#64ffda',
                textTransform: 'capitalize'
              }}
            >
              {sortBy === 'date' ? 'Date' : 
               sortBy === 'name' ? 'Name' : 'Nodes'}
            </Button>
          </Tooltip>
          <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
            <Button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              sx={{ 
                color: '#64ffda', 
                borderColor: '#64ffda',
                minWidth: '40px'
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Graphs Grid */}
      <Grid container spacing={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <CircularProgress sx={{ color: '#64ffda' }} />
          </Box>
        ) : filteredAndSortedGraphs.map((graph) => (
          <Grid item xs={12} sm={6} md={4} key={graph._id}>
            <Card sx={{ 
              bgcolor: '#112240',
              color: '#ffffff',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: getGraphTypeColor(graph.type) }}>
                    {graph.title.charAt(0)}
                  </Avatar>
                }
                action={
                  <IconButton 
                    onClick={() => toggleFavorite(graph._id)}
                    sx={{ color: '#64ffda' }}
                  >
                    {favorites.has(graph._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                }
                title={graph.title}
                subheader={
                  <Typography color="#8892b0" variant="caption">
                    Created on: {graph.created_at ? new Date(graph.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Not available'}
                  </Typography>
                }
              />
              <CardContent>
                <Typography color="#8892b0" sx={{ mb: 2 }}>
                  {graph.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${graph.nodes?.length || 0} Nodes`}
                    size="small"
                    sx={{ bgcolor: '#1d4ed8', color: '#ffffff' }}
                  />
                  <Chip 
                    label={`${graph.edges?.length || 0} Edges`}
                    size="small"
                    sx={{ bgcolor: '#1d4ed8', color: '#ffffff' }}
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ 
                justifyContent: 'space-between', 
                p: 2,
                borderTop: '1px solid rgba(100, 255, 218, 0.1)'
              }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate(`/graph/${graph._id}`)}
                  sx={{ 
                    bgcolor: '#64ffda',
                    color: '#0a192f',
                    '&:hover': { bgcolor: '#4caf50' }
                  }}
                >
                  Open Graph
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    size="small"
                    sx={{ color: '#64ffda' }}
                    onClick={() => navigate(`/graph/${graph._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => handleDeleteClick(graph)}
                    sx={{ color: '#ef4444' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Graph"}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this graph?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <NewGraphDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateGraph}
      />
    </Box>
  );
};

export default Dashboard;