import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';
import '../assets/styles/login.scss';
import { setAuthToken } from '../services/authService';
import { useDispatch } from 'react-redux';
import '../assets/styles/login.scss'



const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const resultAction = await dispatch(loginUser (formData));

            if(loginUser.fulfilled.match(resultAction)) {
                console.log("resultAction.token",resultAction.payload?.token)
                setAuthToken(resultAction.payload?.token);
            navigate('/dashboard');}
            
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2>Iniciar Sesión</h2>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Tu correo electrónico"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Tu contraseña"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-login">
                            Iniciar Sesión
                        </button>
                    </div>

                    <div className="form-footer">
                        <p>
                            ¿No tienes una cuenta? 
                            <a href="/register">Regístrate</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;