import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { FaLock } from 'react-icons/fa';
import { isAuthenticated, validateToken } from '../../services/authService';
import { checkOnboardingStatus, logout } from '../../redux/slices/authSlice';
import '../../assets/styles/privateRoute.scss';

// Selectores memoizados
const selectAuthState = (state) => state.auth;

const selectAuthDetails = createSelector(
  [selectAuthState],
  (auth) => ({
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
    loading: auth.loading || false,
    hasCompletedOnboarding: auth.hasCompletedOnboarding,
    activeQuitPlan: auth.activeQuitPlan
  })
);

export default function PrivateRoute() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationAttempts, setNavigationAttempts] = useState(0);

  // Usar selectores memoizados
  const { user, isAuthenticated: reduxAuthenticated, token, loading, hasCompletedOnboarding, activeQuitPlan } = useSelector(selectAuthDetails);

  useEffect(() => {
    const syncAuthState = async () => {
      if (token) {
        try {
          await dispatch(validateToken(token));
          await dispatch(checkOnboardingStatus()).unwrap();
        } catch (error) {
          console.error('Auth Sync Error', error);
          dispatch(logout());
        }
      }
    };
    
    syncAuthState();
  }, [dispatch, token]);

  const checkAuthentication = useCallback(() => {
    return isAuthenticated() && reduxAuthenticated && !!token;
  }, [reduxAuthenticated, token]);

  if (loading) {
    return <div className="loading-container">Cargando...</div>; // Componente de carga
  }

  if (!checkAuthentication()) {
    return <Navigate to="/login" replace />;
  }

  const handleNavigation = (path) => {
    setNavigationAttempts((prev) => prev + 1);
    navigate(path, { state: { from: location.pathname, attempts: navigationAttempts }, replace: true });
  };

  const renderRedirect = (message, buttonText, path) => (
    <div className="redirect">
      <FaLock className="lock-icon" />
      <h2>{message}</h2>
      <button onClick={() => handleNavigation(path)} className="redirect-btn">
        {buttonText}
      </button>
    </div>
  );

  if (!hasCompletedOnboarding) {
    return renderRedirect('Completa tu perfil de fumador', 'Completar Perfil', '/onboarding');
  }

  if (!activeQuitPlan) {
    return renderRedirect('Crea tu Plan para Dejar de Fumar', 'Crear Plan', '/create-plan');
  }

  // Renderiza las rutas protegidas
  return <Outlet />;
}