import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice.js';
import progressReducer from '../redux/slices/progressSlice.js';
import logoutReducer from './slices/logoutSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        logout: logoutReducer,
        progress: progressReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
});