import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


api.interceptors.request.use(
    async (config) => {
        const token = await localStorage.getItem('token');
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Logging de solicitudes (solo en desarrollo)
        if (import.meta.env.DEV) {
            console.log('Enviando solicitud:', {
                url: config.url,
                method: config.method,
                baseURL: config.baseURL,
                data: config.data
            });
        }
        
        return config;
    },
    error => {
        console.error('Error en configuración de solicitud:', error);
        return Promise.reject(error);
    }
);

// Interceptor de respuestas para manejo de errores
api.interceptors.response.use(
    response => response,
    error => {
        // Logging detallado de errores
        const errorDetails = {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        };

        console.error('Error de red detallado:', errorDetails);

        // Manejo de errores específicos
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('La solicitud ha excedido el tiempo de espera'));
        }

        if (!error.response) {
            return Promise.reject(new Error('No se pudo conectar con el servidor. Verifique su conexión de red.'));
        }

        // Errores específicos del servidor
        switch (error.response.status) {
            case 400:
                return Promise.reject(new Error('Error en la solicitud: Datos inválidos'));
            case 401:
                return Promise.reject(new Error('No autorizado: Credenciales incorrectas'));
            case 403:
                return Promise.reject(new Error('Acceso denegado'));
            case 404:
                return Promise.reject(new Error('Recurso no encontrado'));
            case 500:
                return Promise.reject(new Error('Error interno del servidor'));
            default:
                return Promise.reject(new Error(error.response.data.message || 'Error desconocido'));
        }
    }
);


export const registerUser = async (userData) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error de registro:', error.response?.data || error.message);
        throw error;         
    }
};