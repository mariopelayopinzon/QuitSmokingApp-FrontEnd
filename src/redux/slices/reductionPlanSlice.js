import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Acción para crear un plan de reducción
export const createReductionPlan = createAsyncThunk(
  'reductionPlan/create',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/reduction-plans', planData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Acción para obtener el plan de reducción
export const fetchReductionPlan = createAsyncThunk(
  'reductionPlan/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/reduction-plans/current');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reductionPlanSlice = createSlice({
  name: 'reductionPlan',
  initialState: {
    plan: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    // Casos para crear plan
    builder
      .addCase(createReductionPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReductionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload;
      })
      .addCase(createReductionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    // Casos para obtener plan
    builder
      .addCase(fetchReductionPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReductionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload;
      })
      .addCase(fetchReductionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default reductionPlanSlice.reducer;