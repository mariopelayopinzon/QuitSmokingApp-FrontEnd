import React, { useState, useEffect } from 'react';
import {  
  FaHeartbeat, 
  FaMoneyBillWave, 
  FaSmoking, 
  FaCheckCircle 
} from 'react-icons/fa';
import '../assets/styles/progress.scss';

const Progress = () => {
  const [smokeFreeStats, setSmokeFreeStats] = useState({
    daysSinceQuit: 0,
    cigarettesAvoided: 0,
    moneySaved: 0,
    healthImprovement: 0
  });

  useEffect(() => {
    // Simular cálculo de progreso 
    // En producción, esto vendría de tu backend/estado global
    const quitDate = new Date('2024-01-15');
    const today = new Date();
    const daysSinceQuit = Math.floor((today - quitDate) / (1000 * 60 * 60 * 24));

    setSmokeFreeStats({
      daysSinceQuit: daysSinceQuit,
      cigarettesAvoided: daysSinceQuit * 15, // Asumiendo 15 cigarrillos/día
      moneySaved: (daysSinceQuit * 15 * 0.5).toFixed(2), // Precio estimado por cigarrillo
      healthImprovement: calculateHealthScore(daysSinceQuit)
    });
  }, []);

  const calculateHealthScore = (days) => {
    // Lógica simple de mejora de salud
    if (days < 30) return 20;
    if (days < 90) return 50;
    if (days < 180) return 75;
    return 90;
  };

  const ProgressCard = ({ icon: Icon, title, value, description }) => (
    <div className="progress-card">
      <div className="card-header">
        <Icon className="card-icon" />
        <h3>{title}</h3>
      </div>
      <div className="card-content">
        <p className="card-value">{value}</p>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="progress-container">
      <header className="progress-header">
        <h1>Tu Progreso para Dejar de Fumar</h1>
        <p>Celebra cada día sin cigarrillos</p>
      </header>

      <div className="progress-grid">
        <ProgressCard 
          icon={FaCheckCircle}
          title="Días Sin Fumar"
          value={smokeFreeStats.daysSinceQuit}
          description="Días consecutivos sin cigarrillos"
        />

        <ProgressCard 
          icon={FaSmoking}
          title="Cigarrillos Evitados"
          value={smokeFreeStats.cigarettesAvoided}
          description="Cigarrillos que no has consumido"
        />

        <ProgressCard 
          icon={FaMoneyBillWave}
          title="Dinero Ahorrado"
          value={`$${smokeFreeStats.moneySaved}`}
          description="Estimado de ahorro"
        />

        <ProgressCard 
          icon={FaHeartbeat}
          title="Mejora de Salud"
          value={`${smokeFreeStats.healthImprovement}%`}
          description="Recuperación progresiva"
        />
      </div>

      <div className="progress-motivation">
        <h2>¡Sigue Adelante!</h2>
        <p>Cada día sin fumar es un paso más hacia una vida más saludable.</p>
      </div>
    </div>
  );
};

export default Progress;