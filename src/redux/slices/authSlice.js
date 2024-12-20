import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Token no válido');
      }
      const data = await response.json();
      return data; // Devuelve los datos que se usarán en el reducer
    } catch (error) {
      return rejectWithValue(error.message); // Manejo de errores
    }
  }
);
// Función para verificar expiración de token
const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Verificar si el token ha expirado
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Error al verificar expiración del token:', error);
        return true;
    }
};

// Configuración de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});

//Verificar estado onboarding 
export const checkOnboardingStatus = createAsyncThunk(
  'auth/checkOnboardingStatus', 
  async (__,{ rejectWithValue}) => {
    try {
      const response = await api.get('user/onboarding-status');
      return response.data.hasCompleteOnboarding;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al verificar estado de onboarding');
      
    }
  }
);

// Thunk de registro
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem('token', token);
      
      return { user, token };
    } catch (error) {
      const message = error.response?.data?.message || 'Error de registro';
      return rejectWithValue(message);
    }
  }
);

// Thunk de login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      const { token, user } = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem('token', token);
      
      return { user, token };
    } catch (error) {
      const message = error.response?.data?.message || 'Error de inicio de sesión';
      return rejectWithValue(message);
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async (onboardingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/onboarding', onboardingData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al completar onboarding'); 
      
    }
  }
)

// Slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: (() => {
      const token = localStorage.getItem('token');
      return !!token && !isTokenExpired(token);
    })(),
    loading: false,
    error: null,
    hasCompletedOnboarding: false, 
  },
  reducers: {
    setOnboardingStatus: (state,action) => {
      state.hasCompletedOnboarding = action.payload;
    },

    // Cerrar sesión
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    
    // Resetear estado de autenticación
    resetState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },

    // Actualizar credenciales manualmente
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },

  },
  extraReducers: (builder) => {
    //Casos para onboarding
    builder
      .addCase(checkOnboardingStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkOnboardingStatus.fulfilled, (state, action) => {
        state.hasCompletedOnboarding = action.payload;
        state.loading = false;
      })
      .addCase(checkOnboardingStatus.rejected, (state, action) => {
        state.hasCompletedOnboarding = false;
        state.loading = false;
        state.error = action.payload;
      });

    // Casos para registro de usuario
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.hasCompletedOnboarding = action.payload.user?.hasCompletedOnboarding || false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
    // Casos para inicio de sesión
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.hasCompletedOnboarding = action.payload.user?.hasCompletedOnboarding || false; 
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    });
  }
});

// Exportar acciones y reducer
export const { 
  logout, 
  resetState, 
  setCredentials, 
  setOnboardingStatus
} = authSlice.actions;

export default authSlice.reducer;