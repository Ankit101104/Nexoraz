import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const NewGraphDialog = ({ open, onClose, onSubmit }) => {
  const [graphData, setGraphData] = useState({
    title: '',
    description: ''
  });

  const handleSubmit = () => {
    onSubmit(graphData);
    setGraphData({ title: '', description: '' });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      aria-labelledby="new-graph-dialog-title"
    >
      <DialogTitle id="new-graph-dialog-title" sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Create New Knowledge Graph
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={graphData.title}
          onChange={(e) => setGraphData({ ...graphData, title: e.target.value })}
          id="graph-title"
          aria-label="Graph title"
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={graphData.description}
          onChange={(e) => setGraphData({ ...graphData, description: e.target.value })}
          id="graph-description"
          aria-label="Graph description"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!graphData.title.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewGraphDialog; 