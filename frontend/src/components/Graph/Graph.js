import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Paper, 
  TextField, 
  IconButton, 
  Tooltip, 
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  Fab,
  Zoom,
  Link
} from '@mui/material';
import axios from '../../utils/axios';
import { Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import SearchIcon from '@mui/icons-material/Search';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import MenuIcon from '@mui/icons-material/Menu';
import { 
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  ViewModule as ViewModuleIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const Graph = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [network, setNetwork] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPhysicsEnabled, setIsPhysicsEnabled] = useState(true);
  const [layout, setLayout] = useState('force'); // 'force' or 'hierarchical'
  const [controlsOpen, setControlsOpen] = useState(!isMobile);
  const [wikiInfo, setWikiInfo] = useState(null);
  const [loadingWiki, setLoadingWiki] = useState(false);

  useEffect(() => {
    setControlsOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await axios.get(`/api/graphs/${id}`);
        if (response.data) {
          setGraph(response.data);
        } else {
          setError('Graph not found');
        }
      } catch (error) {
        console.error('Error fetching graph:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [id]);

  useEffect(() => {
    if (!graph) return;

    // Node and edge styling
    const nodes = graph.nodes.map(node => ({
      id: node.id,
      label: node.label,
      title: `Node ${node.id}`,
      color: {
        background: getNodeColor(node.type),
        border: 'rgba(255, 255, 255, 0.3)',
        highlight: {
          background: 'rgba(255, 255, 255, 0.15)',
          border: getNodeColor(node.type)
        },
        hover: {
          background: 'rgba(255, 255, 255, 0.1)',
          border: getNodeColor(node.type)
        }
      },
      font: {
        size: node.type === 'main' ? 18 : 14,
        color: 'rgba(255, 255, 255, 0.8)',
        face: 'Arial',
        background: 'rgba(10, 25, 47, 0.7)',
        strokeWidth: 0,
        strokeColor: 'rgba(10, 25, 47, 0.7)'
      },
      size: node.type === 'main' ? 35 : 25,
      margin: 12,
      widthConstraint: {
        minimum: 50,
        maximum: 150
      }
    }));

    const edges = graph.edges.map(edge => ({
      from: edge.source,
      to: edge.target,
      label: edge.label,
      color: { 
        color: 'rgba(100, 255, 218, 0.3)',
        highlight: 'rgba(100, 255, 218, 0.5)',
        hover: 'rgba(100, 255, 218, 0.5)',
        opacity: 0.6 
      },
      font: {
        size: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        face: 'Arial',
        background: 'rgba(10, 25, 47, 0.7)',
        strokeWidth: 0,
        strokeColor: 'rgba(10, 25, 47, 0.7)',
        align: 'middle',
        multi: false,
        vadjust: -20
      },
      arrows: { 
        to: { 
          enabled: true, 
          scaleFactor: 0.3,
          type: 'arrow'
        } 
      },
      smooth: { 
        enabled: true,
        type: 'continuous',
        roundness: 0.3,
        forceDirection: 'none'
      },
      width: 1,
      length: 250,
      labelHighlightBold: false,
      physics: true,
      chosen: {
        edge: (values, id, selected, hovering) => {
          values.color = hovering ? 'rgba(255, 255, 255, 0.4)' : 'rgba(100, 255, 218, 0.3)';
          values.width = hovering ? 2 : 1;
        },
        label: (values, id, selected, hovering) => {
          values.color = hovering ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)';
          values.strokeColor = hovering ? 'rgba(10, 25, 47, 0.8)' : 'rgba(10, 25, 47, 0.7)';
        }
      }
    }));

    const options = {
      nodes: {
        shape: 'dot',
        size: 25,
        font: {
          size: 14,
          color: 'rgba(255, 255, 255, 0.8)',
          face: 'Arial',
          background: 'rgba(10, 25, 47, 0.7)',
          strokeWidth: 0,
          strokeColor: 'rgba(10, 25, 47, 0.7)',
          multi: false,
          vadjust: -25
        },
        borderWidth: 1,
        margin: 12,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.1)',
          size: 3,
          x: 0,
          y: 2
        },
        chosen: {
          node: (values, id, selected, hovering) => {
            if (hovering) {
              values.shadow = true;
              values.shadowColor = 'rgba(100, 255, 218, 0.5)';
              values.shadowSize = 10;
            }
          }
        }
      },
      edges: {
        width: 1,
        color: {
          color: 'rgba(100, 255, 218, 0.3)',
          highlight: 'rgba(100, 255, 218, 0.5)',
          hover: 'rgba(100, 255, 218, 0.5)',
          opacity: 0.6
        },
        font: {
          size: 12,
          color: 'rgba(255, 255, 255, 0.6)',
          face: 'Arial',
          background: 'rgba(10, 25, 47, 0.7)',
          strokeWidth: 0,
          strokeColor: 'rgba(10, 25, 47, 0.7)',
          align: 'middle',
          multi: false,
          vadjust: -20
        },
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.3,
            type: 'arrow'
          }
        },
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.3,
          forceDirection: 'none'
        },
        selectionWidth: 2,
        labelHighlightBold: false,
        chosen: true
      },
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled: layout === 'hierarchical',
          direction: 'UD',
          sortMethod: 'directed',
          nodeSpacing: 200,
          levelSeparation: 250,
          treeSpacing: 250,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true
        }
      },
      physics: {
        enabled: isPhysicsEnabled,
        solver: layout === 'hierarchical' ? 'hierarchicalRepulsion' : 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -1000,
          centralGravity: 0.005,
          springLength: 300,
          springConstant: 0.05,
          damping: 0.4,
          avoidOverlap: 1
        },
        hierarchicalRepulsion: {
          centralGravity: 0.0,
          springLength: 300,
          springConstant: 0.01,
          nodeDistance: 250,
          damping: 0.09
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          fit: true
        },
        timestep: 0.5,
        adaptiveTimestep: true,
        minVelocity: 0.75
      },
      interaction: {
        hover: true,
        zoomView: true,
        dragView: true,
        dragNodes: true,
        navigationButtons: true,
        keyboard: true,
        tooltipDelay: 200,
        hideEdgesOnDrag: true,
        hideEdgesOnZoom: true
      }
    };

    // Create and configure the network
    const container = document.getElementById('network-graph');
    if (container) {
      const networkInstance = new Network(container, { nodes, edges }, options);
      
      // Initial positioning
      const mainNode = graph.nodes.find(n => n.type === 'main');
      if (mainNode) {
        networkInstance.once('stabilizationIterationsDone', () => {
          const positions = networkInstance.getPositions();
          const nodeIds = Object.keys(positions);
          
          // Calculate the center of mass
          let centerX = 0, centerY = 0;
          nodeIds.forEach(id => {
            centerX += positions[id].x;
            centerY += positions[id].y;
          });
          centerX /= nodeIds.length;
          centerY /= nodeIds.length;
          
          // Move main node to center and others radially
          networkInstance.moveNode(mainNode.id, centerX, centerY);
          const otherNodes = nodeIds.filter(id => id !== mainNode.id);
          const radius = 400;
          const angleStep = (2 * Math.PI) / otherNodes.length;
          
          otherNodes.forEach((id, index) => {
            const angle = angleStep * index;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            networkInstance.moveNode(id, x, y);
          });
          
          networkInstance.fit({
            animation: {
              duration: 1000,
              easingFunction: 'easeOutQuad'
            }
          });
        });
      }

      // Add click handler for node selection
      networkInstance.on('click', (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = graph.nodes.find(n => n.id === nodeId);
          setSelectedNode(node);
          setDialogOpen(true);
        }
      });

      // Add hover event handler for tooltips
      networkInstance.on('hoverNode', (params) => {
        container.style.cursor = 'pointer';
      });
      
      networkInstance.on('blurNode', () => {
        container.style.cursor = 'default';
      });
      
      networkInstance.on('hoverEdge', () => {
        container.style.cursor = 'pointer';
      });
      
      networkInstance.on('blurEdge', () => {
        container.style.cursor = 'default';
      });

      setNetwork(networkInstance);
    }

    return () => {
      if (network) {
        network.destroy();
      }
    };
  }, [graph]);

  // Helper functions for node styling
  function getNodeColor(type) {
    switch (type) {
      case 'main': return 'rgba(100, 255, 218, 0.7)';
      case 'concept': return 'rgba(0, 188, 212, 0.7)';
      case 'feature': return 'rgba(124, 58, 237, 0.7)';
      case 'location': return 'rgba(76, 175, 80, 0.7)';
      case 'organization': return 'rgba(255, 152, 0, 0.7)';
      default: return 'rgba(100, 255, 218, 0.7)';
    }
  }

  function getNodeSize(type) {
    switch (type) {
      case 'main': return 35;
      case 'concept': return 25;
      case 'feature': return 20;
      default: return 15;
    }
  }

  function getNodeShape(type) {
    switch (type) {
      case 'main': return 'star';
      case 'concept': return 'hexagon';
      case 'feature': return 'diamond';
      case 'person': return 'circularImage';
      case 'event': return 'triangle';
      case 'location': return 'square';
      case 'organization': return 'database';
      default: return 'dot';
    }
  }

  function getNodeLevel(node, graph) {
    if (node.type === 'main') return 0;
    
    // Find shortest path to main node
    const mainNode = graph.nodes.find(n => n.type === 'main');
    if (!mainNode) return 1;

    const edges = graph.edges.map(e => ({
      from: e.source,
      to: e.target
    }));

    let level = 1;
    let currentNodes = [mainNode.id];
    let visited = new Set([mainNode.id]);

    while (currentNodes.length > 0) {
      const nextNodes = [];
      for (const currentId of currentNodes) {
        const connectedEdges = edges.filter(e => e.from === currentId || e.to === currentId);
        for (const edge of connectedEdges) {
          const nextId = edge.from === currentId ? edge.to : edge.from;
          if (!visited.has(nextId)) {
            if (nextId === node.id) return level;
            visited.add(nextId);
            nextNodes.push(nextId);
          }
        }
      }
      currentNodes = nextNodes;
      level++;
    }

    return level;
  }

  const handleSearch = () => {
    if (!network || !searchTerm) return;
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    // Find matching nodes
    const matchingNodes = graph.nodes.filter(node => 
      node.label.toLowerCase().includes(searchTermLower) ||
      node.description.toLowerCase().includes(searchTermLower) ||
      node.type.toLowerCase().includes(searchTermLower)
    );

    if (matchingNodes.length > 0) {
      // Highlight matching nodes
      network.selectNodes(matchingNodes.map(node => node.id));
      
      // Focus the network on the matching nodes
      network.fit({
        nodes: matchingNodes.map(node => node.id),
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      });

      // Highlight the nodes with a different color
      const updatedNodes = graph.nodes.map(node => ({
        ...node,
        color: matchingNodes.some(n => n.id === node.id) 
          ? { 
              background: '#ffffff',
              border: getNodeColor(node.type),
              highlight: {
                background: '#ffffff',
                border: getNodeColor(node.type)
              }
            }
          : {
              background: getNodeColor(node.type),
              border: '#ffffff',
              highlight: {
                background: '#ffffff',
                border: getNodeColor(node.type)
              }
            }
      }));

      network.setData({ 
        nodes: updatedNodes, 
        edges: graph.edges 
      });

      // Reset node colors after 2 seconds
      setTimeout(() => {
        const originalNodes = graph.nodes.map(node => ({
          ...node,
          color: {
            background: getNodeColor(node.type),
            border: '#ffffff',
            highlight: {
              background: '#ffffff',
              border: getNodeColor(node.type)
            }
          }
        }));
        network.setData({ nodes: originalNodes, edges: graph.edges });
      }, 2000);
    } else {
      // Show "no results" message using the network's manipulation system
      network.setData({ nodes: graph.nodes, edges: graph.edges });
      alert('No matching nodes found');
    }
  };

  // Add keydown event handler for search
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search nodes..."]');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleZoomIn = () => {
    if (!network) return;
    const currentScale = network.getScale();
    network.moveTo({
      scale: currentScale * 1.5,
      animation: {
        duration: 500,
        easingFunction: 'easeInOutQuad'
      }
    });
  };

  const handleZoomOut = () => {
    if (!network) return;
    const currentScale = network.getScale();
    network.moveTo({
      scale: currentScale * 0.75,
      animation: {
        duration: 500,
        easingFunction: 'easeInOutQuad'
      }
    });
  };

  const handleFitView = () => {
    if (!network) return;
    network.fit({
      animation: {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
    });
  };

  const togglePhysics = () => {
    network?.setOptions({ physics: { enabled: !isPhysicsEnabled } });
    setIsPhysicsEnabled(!isPhysicsEnabled);
  };

  const resetLayout = () => {
    network?.stabilize();
  };

  const toggleLayout = () => {
    const newLayout = layout === 'force' ? 'hierarchical' : 'force';
    setLayout(newLayout);
    network?.setOptions({
      layout: {
        hierarchical: {
          enabled: newLayout === 'hierarchical',
          direction: 'UD',
          sortMethod: 'directed',
          nodeSpacing: 200,
          levelSeparation: 250
        }
      }
    });
  };

  const Legend = () => {
    const categories = [
      { type: 'main', label: 'Main Topic', color: '#64ffda' },
      { type: 'concept', label: 'Concept', color: '#00bcd4' },
      { type: 'feature', label: 'Feature', color: '#7c3aed' },
      { type: 'location', label: 'Location', color: '#4caf50' },
      { type: 'organization', label: 'Organization', color: '#ff9800' }
    ];

    return (
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 1,
          bgcolor: 'rgba(17, 34, 64, 0.95)',
          borderRadius: 1,
          border: '1px solid rgba(100, 255, 218, 0.1)',
          overflow: 'hidden',
          maxWidth: 200,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ 
          px: 1.5, 
          py: 1,
          borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
          bgcolor: 'rgba(10, 25, 47, 0.5)'
        }}>
          <Typography variant="caption" color="#64ffda" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Node Types
        </Typography>
        </Box>
        
        <Box sx={{ p: 1.5 }}>
        {categories.map((cat) => (
            <Box
              key={cat.type}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 0.75,
                '&:last-child': { mb: 0 }
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                bgcolor: cat.color,
                  borderRadius: '50%',
                  mr: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  flexShrink: 0
                }}
              />
              <Typography 
                variant="caption" 
                color="#ffffff"
                sx={{ 
                  fontSize: '0.75rem',
                  lineHeight: 1.2
                }}
              >
              {cat.label}
            </Typography>
          </Box>
        ))}
      </Box>
      </Paper>
    );
  };

  const GraphStats = ({ graph }) => (
    <Box
      sx={{
        position: 'absolute',
        top: 80,
        right: 20,
        zIndex: 1,
        bgcolor: 'rgba(17, 34, 64, 0.9)',
        p: 2,
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="subtitle2" color="#64ffda" gutterBottom>
        Graph Statistics
      </Typography>
      <Typography variant="caption" color="#ffffff" display="block">
        Nodes: {graph?.nodes?.length || 0}
      </Typography>
      <Typography variant="caption" color="#ffffff" display="block">
        Edges: {graph?.edges?.length || 0}
      </Typography>
      <Typography variant="caption" color="#ffffff" display="block">
        Density: {((graph?.edges?.length || 0) / ((graph?.nodes?.length || 1) * ((graph?.nodes?.length || 1) - 1))).toFixed(2)}
      </Typography>
    </Box>
  );

  // Update the node positioning function
  const positionNodesRadially = (network, nodes, mainNodeId) => {
    const mainNode = nodes.find(n => n.id === mainNodeId);
    const otherNodes = nodes.filter(n => n.id !== mainNodeId);
    
    // Center position
    const center = { x: 0, y: 0 };
    
    // Set main node position
    network.moveNode(mainNodeId, center.x, center.y);

    // Position other nodes in a circle
    const radius = 300;
    const angleStep = (2 * Math.PI) / otherNodes.length;
    
    otherNodes.forEach((node, index) => {
      const angle = angleStep * index;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      network.moveNode(node.id, x, y);
    });

    // Optional: Gentle fit only on initial load
    if (!network.getScale()) {  // Only if not already scaled
      network.fit({
        animation: {
          duration: 1000,
          easingFunction: 'easeOutQuad'
        }
      });
    }
  };

  const generateDetailedGraph = async (title, description) => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-graph-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          description,
          type: 'concept'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('Error generating graph data:', error);
      throw error;
    }
  };

  // Add this new function to fetch Wikipedia information
  const fetchWikipediaInfo = async (searchTerm) => {
    setLoadingWiki(true);
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        if (response.status === 404) {
          setWikiInfo({ error: 'No Wikipedia article found for this topic.' });
          return;
        }
        throw new Error(`Wikipedia API error: ${response.status}`);
      }
      const data = await response.json();
      setWikiInfo(data);
    } catch (error) {
      console.error('Error fetching Wikipedia info:', error);
      setWikiInfo({ 
        error: 'Unable to fetch Wikipedia information. Please try again later.' 
      });
    } finally {
      setLoadingWiki(false);
    }
  };

  // Update the click handler to fetch Wikipedia info when a node is selected
  useEffect(() => {
    if (selectedNode) {
      // Clean up the search term by removing special characters and formatting
      const cleanSearchTerm = selectedNode.label
        .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
        .trim();
      if (cleanSearchTerm) {
        fetchWikipediaInfo(cleanSearchTerm);
      }
    }
  }, [selectedNode]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          bgcolor: '#0a192f'
        }}
      >
        <CircularProgress sx={{ color: '#64ffda' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
        display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
        alignItems: 'center',
          bgcolor: '#0a192f',
          p: 3
        }}
      >
        <Typography color="error" variant="h6" gutterBottom align="center">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard')}
          sx={{ 
            mt: 2,
            bgcolor: '#64ffda',
            color: '#0a192f',
            '&:hover': {
              bgcolor: '#4caf50'
            }
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const ControlPanel = () => (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '300px'
      }}
    >
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{
          bgcolor: 'rgba(17, 34, 64, 0.95)',
          color: '#64ffda',
          border: '1px solid rgba(100, 255, 218, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(100, 255, 218, 0.1)',
          },
          textTransform: 'none',
          fontSize: '0.9rem',
          py: 1,
          width: '100%'
        }}
      >
        Back to Dashboard
      </Button>

      {/* Search Section */}
      <Box sx={{ p: 2 }}>
          <TextField
          fullWidth
            size="small"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            sx: {
              bgcolor: 'rgba(10, 25, 47, 0.5)',
              '& fieldset': {
                borderColor: 'rgba(100, 255, 218, 0.2)'
              }
            }
          }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '&:hover fieldset': { borderColor: '#64ffda' },
              '&.Mui-focused fieldset': { borderColor: '#64ffda' },
              }
            }}
          />
        </Box>
        
      {/* View Controls Section */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#64ffda',
            mb: 1,
            fontSize: '0.9rem'
          }}
        >
          View Controls
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 1,
          '& .MuiIconButton-root': {
            bgcolor: 'rgba(10, 25, 47, 0.5)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            borderRadius: 1,
            color: '#64ffda',
            '&:hover': {
              bgcolor: 'rgba(100, 255, 218, 0.1)'
            }
          }
        }}>
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit View">
            <IconButton onClick={handleFitView}>
              <CenterFocusStrongIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Layout Controls Section */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#64ffda',
            mb: 1,
            fontSize: '0.9rem'
          }}
        >
          Layout Controls
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 1,
          '& .MuiIconButton-root': {
            bgcolor: 'rgba(10, 25, 47, 0.5)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            borderRadius: 1,
            color: '#64ffda',
            '&:hover': {
              bgcolor: 'rgba(100, 255, 218, 0.1)'
            }
          }
        }}>
          <Tooltip title={isPhysicsEnabled ? "Pause Physics" : "Resume Physics"}>
            <IconButton onClick={togglePhysics}>
              {isPhysicsEnabled ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Layout">
            <IconButton onClick={resetLayout}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Switch to ${layout === 'force' ? 'Hierarchical' : 'Force'} Layout`}>
            <IconButton onClick={toggleLayout}>
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Graph Statistics Section */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#64ffda',
            mb: 1,
            fontSize: '0.9rem'
          }}
        >
          Graph Statistics
        </Typography>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography variant="body2" color="#ffffff">
            Nodes: {graph?.nodes?.length || 0}
          </Typography>
          <Typography variant="body2" color="#ffffff">
            Edges: {graph?.edges?.length || 0}
          </Typography>
          <Typography variant="body2" color="#ffffff">
            Density: {((graph?.edges?.length || 0) / ((graph?.nodes?.length || 1) * ((graph?.nodes?.length || 1) - 1))).toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Node Types Section */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#64ffda',
            mb: 1,
            fontSize: '0.9rem'
          }}
        >
          Node Types
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { type: 'Main Topic', color: '#64ffda' },
            { type: 'Concept', color: '#00bcd4' },
            { type: 'Feature', color: '#7c3aed' },
            { type: 'Location', color: '#4caf50' },
            { type: 'Organization', color: '#ff9800' }
          ].map((node, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: node.color,
                  mr: 1.5
                }}
              />
              <Typography variant="body2" color="#ffffff">
                {node.type}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Legend />
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)',
      position: 'relative'
    }}>
      {/* Controls Panel - Desktop */}
      {!isMobile && controlsOpen && (
        <Box sx={{ 
          width: '320px',
          height: '100%',
          overflow: 'auto',
          borderRight: '1px solid rgba(100, 255, 218, 0.1)'
        }}>
          <ControlPanel />
        </Box>
      )}

      {/* Graph Area */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <div id="network-graph" style={{ height: '100%', width: '100%' }} />
      </Box>

      {/* Controls Panel - Mobile */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={controlsOpen}
          onClose={() => setControlsOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(10, 25, 47, 0.95)',
              width: '100%'
            }
          }}
        >
          <ControlPanel />
        </Drawer>
      )}

      {/* Mobile FAB for opening controls */}
      {isMobile && !controlsOpen && (
        <Zoom in={!controlsOpen}>
          <Fab
            color="primary"
            aria-label="open controls"
            onClick={() => setControlsOpen(true)}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: '#64ffda',
              color: '#0a192f',
              '&:hover': {
                bgcolor: '#4caf50'
              }
            }}
          >
            <MenuIcon />
          </Fab>
        </Zoom>
      )}

      {/* Node Information Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#112240',
            color: '#ffffff',
            borderRadius: 2,
            m: isMobile ? 2 : 4
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
          color: '#64ffda',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" component="div" sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }}>
          {selectedNode?.label}
          </Typography>
          <IconButton 
            onClick={() => setDialogOpen(false)}
            sx={{ color: '#64ffda' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {/* Node Type */}
          <Paper sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: 'rgba(10, 25, 47, 0.5)',
            border: '1px solid rgba(100, 255, 218, 0.1)'
          }}>
            <Typography variant="subtitle2" color="#64ffda" gutterBottom>
              Type
            </Typography>
            <Typography variant="body1" color="#ffffff">
              {selectedNode?.type}
            </Typography>
          </Paper>

          {/* Node Description */}
          <Paper sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'rgba(10, 25, 47, 0.5)',
            border: '1px solid rgba(100, 255, 218, 0.1)'
          }}>
            <Typography variant="subtitle2" color="#64ffda" gutterBottom>
              Description
          </Typography>
          <Typography variant="body1" color="#ffffff">
            {selectedNode?.description}
          </Typography>
          </Paper>

          {/* Wikipedia Information Section */}
          {selectedNode && (
            <Paper sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'rgba(10, 25, 47, 0.5)',
              border: '1px solid rgba(100, 255, 218, 0.1)'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="#64ffda">
                  Detailed Information
              </Typography>
                {wikiInfo?.content_urls?.desktop?.page && !wikiInfo.error && (
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<LaunchIcon />}
                    onClick={() => window.open(wikiInfo.content_urls.desktop.page, '_blank')}
                    sx={{ 
                      color: '#64ffda',
                      borderColor: '#64ffda',
                      '&:hover': {
                        borderColor: '#4caf50',
                        bgcolor: 'rgba(100, 255, 218, 0.1)'
                      }
                    }}
                  >
                    View on Wikipedia
                  </Button>
                )}
              </Box>
              
              {loadingWiki ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#64ffda' }} />
                </Box>
              ) : wikiInfo ? (
                <>
                  {wikiInfo.error ? (
                    <Typography variant="body2" color="#8892b0" sx={{ fontStyle: 'italic' }}>
                      {wikiInfo.error}
                    </Typography>
                  ) : (
                    <>
                      {wikiInfo.thumbnail && (
                        <Box 
                          component="img"
                          src={wikiInfo.thumbnail.source}
                          alt={wikiInfo.title}
                          sx={{ 
                            width: '100%',
                            maxWidth: 300,
                            height: 'auto',
                            borderRadius: 1,
                            mb: 2,
                            display: 'block',
                            margin: '0 auto'
                          }}
                        />
                      )}
                      <Typography variant="body1" color="#ffffff" paragraph>
                        {wikiInfo.extract}
                      </Typography>
                    </>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="#8892b0" sx={{ fontStyle: 'italic' }}>
                  No Wikipedia information available for this topic.
                </Typography>
              )}
            </Paper>
          )}

          {/* Related Nodes Section */}
          {selectedNode && (
            <Paper sx={{ 
              p: 2, 
              bgcolor: 'rgba(10, 25, 47, 0.5)',
              border: '1px solid rgba(100, 255, 218, 0.1)'
            }}>
              <Typography variant="subtitle2" color="#64ffda" gutterBottom>
                Related Topics
              </Typography>
              <Box sx={{ 
                maxHeight: '200px', 
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: 'rgba(10, 25, 47, 0.5)',
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: '#64ffda',
                  borderRadius: '4px',
                }
              }}>
                {graph.nodes
                  .filter(node => 
                    node.id !== selectedNode.id && 
                    (node.type === selectedNode.type || 
                     graph.edges.some(edge => 
                       (edge.source === node.id && edge.target === selectedNode.id) ||
                       (edge.target === node.id && edge.source === selectedNode.id)
                     ))
                  )
                  .map((node, index) => (
                    <Paper 
                      key={index}
                      sx={{ 
                        p: 1.5, 
                        mt: 1, 
                        bgcolor: 'rgba(10, 25, 47, 0.8)',
                        border: '1px solid rgba(100, 255, 218, 0.1)',
                        '&:first-of-type': { mt: 0 },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(100, 255, 218, 0.1)',
                        }
                      }}
                      onClick={() => {
                        setSelectedNode(node);
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography color="#ffffff">
                          {node.label}
                      </Typography>
                        <Typography variant="caption" sx={{ color: '#8892b0' }}>
                          {node.type}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
            </Box>
            </Paper>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Graph; 
