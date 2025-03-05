import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
); 