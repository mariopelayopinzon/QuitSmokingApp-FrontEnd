import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { FaLock } from 'react-icons/fa';
import { isAuthenticated, validateToken } from '../../services/authService';
import { checkOnboardingStatus, logout } from '../../redux/slices/authSlice';
import '../../assets/styles/privateRoute.scss';

// Selector memoizado
const selectAuthDetails = createSelector(
  [(state) => state.auth],
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
  const navigate = useNavigate();

  const { 
    isAuthenticated: reduxAuthenticated, 
    token, 
    loading,
    hasCompletedOnboarding, 
    activeQuitPlan 
  } = useSelector(selectAuthDetails);

  // Efecto principal de autenticación y navegación
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Verificar autenticación
      if (!reduxAuthenticated) {
        navigate('/login');
        return;
      }

      // Validar token
      if (token) {
        try {
          validateToken(token);
          await dispatch(checkOnboardingStatus()).unwrap();
        } catch (error) {
          console.error('Auth Sync Error', error);
          dispatch(logout());
          navigate('/login');
        }
      }

      // Verificar estado de onboarding
      if (!hasCompletedOnboarding) {
        navigate('/onboarding');
        return;
      }

      // Verificar plan de reducción
      if (!activeQuitPlan) {
        navigate('/reduction-plan');
        return;
      }
    };

    checkAuthStatus();
  }, [
    reduxAuthenticated, 
    token, 
    hasCompletedOnboarding, 
    activeQuitPlan, 
    dispatch, 
    navigate
  ]);

  // Componente de carga
  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  // Renderizado condicional de rutas protegidas
  return reduxAuthenticated && hasCompletedOnboarding && activeQuitPlan 
    ? <Outlet /> 
    : null;
}