import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';;
import { api } from '../../services/api'; 

export const fetchProgress = createAsyncThunk(
    'progress/fetchProgress',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/reduction/progress');
            return {
                cigarettesReduced: response.data.cigarettesReduced || 0, 
                totalCigarettes: response.data.totalCigarettes || 0
            }; 
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
            state.error = null; 
        })
        .addCase(fetchProgress.rejected, (state, action) => {
            state.error = action.payload || 'An error ocurred'; 
            state.loading = false; 

            state.cigarettesReduced = 0; 
            state.totalCigarettes = 0; 
        }); 
    }
});

export default progressSlice.reducer;