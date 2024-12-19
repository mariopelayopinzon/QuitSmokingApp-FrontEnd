import axios from 'axios';

// Función para obtener puerto seguro
const getSecurePort = () => {
    const safePorts = [3000, 5000, 5173, 8000, 8080, 6000];
    const envPort = import.meta.env.VITE_API_PORT 
        ? parseInt(import.meta.env.VITE_API_PORT) 
        : 6000;

    // Verificar si el puerto está en la lista de puertos seguros
    return safePorts.includes(envPort) ? envPort : safePorts[0];
};

// Función para construir URL base segura
const getBaseURL = () => {
    const port = getSecurePort();
    return `http://localhost:${port}`;
};

// Crear URL base
const API_BASE_URL = getBaseURL();

// Crear instancia de Axios con configuración mejorada
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    },
    timeout: 15000 // Aumentar timeout
});

// Interceptor de solicitudes para añadir token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
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
        console.log('Intentando registrar usuario', userData); 
        console.log('URL de registro', `${API_BASE_URL}/api/auth/register`);

        const response = await api.post('/api/auth/register', userData); 

        console.log('Respuesta de registro:', response.data); 
        return response.data;
    } catch (error) {
        console.error('Detalles completos del error de registro', {
            response: error.response?.data, 
            status: error.response?.status, 
            message: error.message,
            config: error.config
        });

        throw error;
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

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token); 
    } else {
        delete api.defaults.headers.common['Authorization']; 
        localStorage.removeItem('token');
    }
};

// Función para verificar autenticación
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// Función de logout
export const logout = () => {
    setAuthToken(null);
};

export default api;