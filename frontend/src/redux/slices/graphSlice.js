import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchGraphs = createAsyncThunk(
  'graph/fetchGraphs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/graphs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createGraph = createAsyncThunk(
  'graph/createGraph',
  async (graphData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/graphs', graphData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteGraph = createAsyncThunk(
  'graphs/deleteGraph',
  async (graphId) => {
    await axios.delete(`http://localhost:5000/api/graphs/${graphId}`);
    return graphId;
  }
);

const graphSlice = createSlice({
  name: 'graph',
  initialState: {
    graphs: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraphs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGraphs.fulfilled, (state, action) => {
        state.loading = false;
        state.graphs = action.payload.graphs || [];
        state.error = null;
      })
      .addCase(fetchGraphs.rejected, (state, action) => {
        state.loading = false;
        state.graphs = [];
        state.error = action.payload?.message || 'Failed to fetch graphs';
      })
      .addCase(createGraph.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.graphs.push(action.payload);
        state.error = null;
      })
      .addCase(createGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create graph';
      })
      .addCase(deleteGraph.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.graphs = state.graphs.filter(graph => graph._id !== action.payload);
      })
      .addCase(deleteGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default graphSlice.reducer; 