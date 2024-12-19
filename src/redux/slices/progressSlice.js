import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';;
import axios from 'axios';

export const fetchProgress = createAsyncThunk(
    'progress/fetchProgress',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/progress');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);

        }
    }
); 

const progressSlice = createSlice({
    name: 'progress',
    initialState: {
        cigarettesReduced: 0, 
        totalCigarettes: 0,
        loading: false, 
        error: null
    },
    reducers: {}, 
    extraReducers: (builder) => {
        builder
        .addCase(fetchProgress.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchProgress.fulfilled, (state, action) => {
            state.cigarettesReduced = action.payload.cigarettesReduced; 
            state.totalCigarettes = action.payload.totalCigarettes; 
            state.loading = false; 
        })
        .addCase(fetchProgress.rejected, (state, action) => {
            state.error = action.payload;
            state.loadin = false; 
        }); 
    }
});

export default progressSlice.reducer;