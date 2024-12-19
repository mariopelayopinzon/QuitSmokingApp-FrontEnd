// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Configuración de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});

// Crear thunk de registro
export const registerUser = createAsyncThunk(
  'auth/registerUser', // Nombre de acción único
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Error de registro';
      return rejectWithValue(message);
    }
  }
);

// Resto del código de authSlice (login, logout, etc.)
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: localStorage.getItem('token') || null
  },
  reducers: {
    resetState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Casos para registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  }
});

export const { resetState } = authSlice.actions;
export default authSlice.reducer;