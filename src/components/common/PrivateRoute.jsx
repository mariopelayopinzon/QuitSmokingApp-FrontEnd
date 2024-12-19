import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaLock } from 'react-icons/fa';

export default function PrivateRoute() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  if (!user.hasCompletedOnboarding) {
    return (
      <div className="onboarding-redirect">
        <FaLock className="lock-icon" />
        <h2>Completa tu perfil de fumador</h2>
        <p>Necesitamos algunos detalles para personalizar tu plan de abandono</p>
        <button 
          onClick={() => window.location.href = '/onboarding'}
          className="onboarding-btn"
        >
          Completar Perfil
        </button>
      </div>
    );
  }

  // Verificación de plan activo
  if (!user.activeQuitPlan) {
    return (
      <div className="quit-plan-redirect">
        <FaLock className="lock-icon" />
        <h2>Crea tu Plan para Dejar de Fumar</h2>
        <p>Antes de continuar, necesitas establecer tu plan de abandono</p>
        <button 
          onClick={() => window.location.href = '/create-plan'}
          className="create-plan-btn"
        >
          Crear Plan
        </button>
      </div>
    );
  }

  // Renderiza las rutas protegidas
  return <Outlet />;
};