import React, { useState } from 'react';
import { registerUserService } from '../services/authService';
import '../assets/styles/register.scss'

const Register = () => {
    // Asegúrate de que todos los valores tengan un tipo y valor inicial definido
    const [formData, setFormData] = useState({
        username: '', // string vacío
        email: '',    // string vacío
        password: '', // string vacío
        cigarettesPerDay: '' // string vacío para inputs numéricos
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validación de formulario
    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es obligatorio';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo electrónico inválido';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validación opcional para cigarrillos por día
        if (formData.cigarettesPerDay !== '' &&
            (isNaN(Number(formData.cigarettesPerDay)) ||
                Number(formData.cigarettesPerDay) < 0)) {
            newErrors.cigarettesPerDay = 'Ingrese un número válido de cigarrillos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Limpiar error específico cuando se modifica el campo
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Resetear errores
        setErrors({});

        // Validar formulario
        if (!validateForm()) {
            return;
        }

        // Preparar datos para envío
        const submitData = {
            ...formData,
            cigarettesPerDay: formData.cigarettesPerDay
                ? Number(formData.cigarettesPerDay)
                : 0
        };

        try {
            setIsSubmitting(true);
            const response = await registerUserService(submitData);

            // Manejar respuesta exitosa
            console.log('Registro exitoso:', response);

            // Limpiar formulario
            setFormData({
                username: '',
                email: '',
                password: '',
                cigarettesPerDay: ''
            });

            // Opcional: mostrar mensaje de éxito o redirigir
            alert('Registro exitoso');
        } catch (error) {
            // Manejar errores de registro
            console.error('Error en registro:', error);

            // Mostrar errores del servidor
            if (error.response && error.response.data) {
                const serverErrors = error.response.data;

                // Mapear errores del servidor a los campos del formulario
                const mappedErrors = {};
                if (serverErrors.field) {
                    mappedErrors[serverErrors.field] = serverErrors.message;
                }

                setErrors(mappedErrors);
            } else {
                // Error genérico
                setErrors({
                    submit: error.message || 'Error en el registro'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Registro de Usuario</h2>

            {errors.submit && (
                <div className="error-message">
                    {errors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Campo de nombre de usuario */}
                <div className="form-group">
                    <label htmlFor="username">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nombre de usuario"
                        className={errors.username ? 'input-error' : ''}
                    />
                    {errors.username && (
                        <span className="error-text">{errors.username}</span>
                    )}
                </div>

                {/* Campo de correo electrónico */}
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico"
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && (
                        <span className="error-text">{errors.email}</span>
                    )}
                </div>

                {/* Campo de contraseña */}
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        className={errors.password ? 'input-error' : ''}
                    />
                    {errors.password && (
                        <span className="error-text">{errors.password}</span>
                    )}
                </div>

                {/* Campo de cigarrillos por día */}
                <div className="form-group">
                    <label htmlFor="cigarettesPerDay">Cigarrillos por Día</label>
                    <input
                        type="number"
                        id="cigarettesPerDay"
                        name="cigarettesPerDay"
                        value={formData.cigarettesPerDay}
                        onChange={handleChange}
                        placeholder="Cigarrillos por día"
                        min="0"
                        className={errors.cigarettesPerDay ? 'input-error' : ''}
                    />
                    {errors.cigarettesPerDay && (
                        <span className="error-text">{errors.cigarettesPerDay}</span>
                    )}
                </div>

                {/* Botón de submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
};

export default Register;