import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  fetchProgress,  } from '../redux/slices/progressSlice';
import { fetchReductionPlan } from '../redux/slices/reductionPlanSlice';
import { 
  FaChartLine, 
  FaSmokingBan, 
  FaCalendarAlt, 
  FaTrophy 
} from 'react-icons/fa';
import '../assets/styles/dashboard.scss';

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    cigarettesReduced, 
    totalCigarettes, 
    loading, 
    error,
    reductionPlan 
  } = useSelector((state) => state.progress);

  // Estado local para métricas adicionales
  const [stats, setStats] = useState({
    moneySaved: 0,
    healthImprovement: 0,
    daysWithoutSmoking: 0
  });
  
  useEffect(() => {
    // Cargar progreso y plan de reducción
    dispatch(fetchProgress());
    // dispatch(fetchReductionPlan());
  }, [dispatch]);

  // Calcular estadísticas
  useEffect(() => {
    if (reductionPlan) {
      // Ejemplo de cálculos (ajusta según tus necesidades)
      const cigarettePrice = 0.50; // Precio promedio por cigarrillo
      const moneySaved = cigarettesReduced * cigarettePrice;
      
      // Calcular días sin fumar (ejemplo simplificado)
      const startDate = new Date(reductionPlan.startDate);
      const currentDate = new Date();
      const daysWithoutSmoking = Math.floor(
        (currentDate - startDate) / (1000 * 60 * 60 * 24)
      );

      setStats({
        moneySaved: moneySaved.toFixed(2),
        healthImprovement: calculateHealthImprovement(cigarettesReduced),
        daysWithoutSmoking
      });
    }
  }, [reductionPlan, cigarettesReduced]);

  // Función de cálculo de mejora de salud (ejemplo)
  const calculateHealthImprovement = (cigarettesReduced) => {
    // Lógica de cálculo de mejora de salud
    return Math.min(cigarettesReduced * 0.1, 100).toFixed(1);
  };

  // Renderizado condicional de carga y errores
  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Calcular porcentaje de progreso
  const progressPercentage = totalCigarettes > 0 
    ? (cigarettesReduced / totalCigarettes) * 100 
    : 0;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Bienvenido, {user?.name}</h1>
      </header>

      <section className="progress-overview">
        <div className="progress-card">
          <FaChartLine className="icon" />
          <h2>Progreso de Reducción</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
          <p>{cigarettesReduced} / {totalCigarettes} cigarrillos reducidos</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <FaSmokingBan className="icon" />
            <h3>Cigarrillos Evitados</h3>
            <p>{cigarettesReduced}</p>
          </div>

          <div className="stat-card">
            <FaCalendarAlt className="icon" />
            <h3>Días Sin Fumar</h3>
            <p>{stats.daysWithoutSmoking}</p>
          </div>

          <div className="stat-card">
            <FaTrophy className="icon" />
            <h3>Dinero Ahorrado</h3>
            <p>${stats.moneySaved}</p>
          </div>
        </div>
      </section>

      <section className="quit-plan">
        <h2>Tu Plan de Abandono</h2>
        {reductionPlan ? (
          <div className="plan-details">
            <p>Estrategia: {reductionPlan.strategy}</p>
            <p>Objetivo: Reducir a {reductionPlan.targetCigarettes} cigarrillos/día</p>
            <p>Mejora de Salud: {stats.healthImprovement}%</p>
          </div>
        ) : (
          <p>No hay plan de reducción activo. ¡Crea uno!</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;