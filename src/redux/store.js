import { configureStore } from '@reduxjs/toolkit';
import { 
    FLUSH, 
    REHYDRATE, 
    PAUSE, 
    PERSIST, 
    PURGE, 
    REGISTER 
} from 'redux-persist';
import authReducer from '../redux/slices/authSlice.js';
import progressReducer from '../redux/slices/progressSlice.js';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        progress: progressReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER
                ]
            }
        })
});