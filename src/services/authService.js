
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', 
    },
    timeout: 10000
});

export const registerUser = async (userData) => { 
    try {
        console.log('Intentando registrar usuario', userData); 
        console.log('URL de registro', `${API_BASE_URL}/api/auth/register`);

        const response = await api.post('/api/auth/register', userData); 

        console.log('Respuesta de registro:', response.data); 
        return response.data;
        } catch (error) {
            console.error('Detalles completos del error', {
                response: error.response?.data, 
                status: error.response?.status, 
                message: error.message,
                config: error.config
            });

            if (error.response) {
                throw new Error(
                    error.response.data.message ||
                    'Error en el registro de usuario'
                );
            } else if (error.request) {
                throw new Error('No se recibio respuesta del servidor'); 
            } else {
                throw new Error('Error al configurar la solicitud'); 
            }
        }
};

export const loginUser = async (credentials) => { 
    try {
        const response = await api.post('/api/auth/login', credentials); 
        return response.data; 
    } catch (error) {
        console.error('Error de inicio de sesión:', error.response?.data || error.message);
        throw error;         
    }
};

export const setAuthToke = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] =`Bearer ${token}`;

        localStorage.setItem('token', token); 
    } else {
        delete api.defaults.headers.common['Authorization']; 
        localStorage.removeItem('token');
    }
};