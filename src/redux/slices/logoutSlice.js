import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', 
    withCredentials: true
}); 

export const logout = createAsyncThunk(
    'auth/logout',
     async (_, {dispatch }) => {
        try {
            await api.post('/auth/logout'); 

            localStorage.removeItem('token'); 

            return true; 
        } catch (error) {
            console.error('Error en logout', error); 
            throw error; 
        }
     }
    ); 

    const logoutSlice = createSlice({
        name: 'logout',
        initialState: {
            loading: false, 
            error: null, 
            success: false
        },
        reducers : {},
        extraReducers: (builder) => {
            builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null; 
                state.success = false; 
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.success = true; 
                state.error = null; 
            })
            .addCase(logout.rejected, (state,action) => {
                state.loading = false;
                state.success = false; 
                state.error = action.error.message; 
            });
        }
    });


    export default logoutSlice.reducer; 