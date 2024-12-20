import { registerUser, api } from './api.js';


export const registerUserService = async (userData) => { 
    try {
        console.log('Intentando registrar usuario', userData); 

        const response = await registerUser(userData); 

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



export const setAuthToken = (token) => { 
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        //delete api.defaults.headers.common['Authorization']; 
        //localStorage.removeItem('token');
    }
}

export const validateToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token); 
        return true
    } else {
        console.log("33333")
       // delete api.defaults.headers.common['Authorization']; 
        //localStorage.removeItem('token');
        return false
    }
};

// Función para verificar autenticación
export const isAuthenticated = async() => {
    const token = localStorage.getItem('token');
    return token
};

// Función de logout
export const logout = () => {
    validateToken(null);
};

export default api;