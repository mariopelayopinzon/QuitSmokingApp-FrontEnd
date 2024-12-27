import React from 'react';
import { Link } from 'react-router-dom';
import { FaSmoking, FaHeartbeat, FaChartLine, FaSignInAlt } from 'react-icons/fa';
import '../assets/styles/Home.scss';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Quit Smoking App</h1>
        <p>Tu compañero para dejar de fumar</p>
      </header>

      <section className="home-features">
        <div className="feature">
          <FaSmoking className="feature-icon" />
          <h3>Seguimiento de Consumo</h3>
          <p>Registra y monitorea tu consumo de cigarrillos</p>
        </div>

        <div className="feature">
          <FaHeartbeat className="feature-icon" />
          <h3>Mejora tu Salud</h3>
          <p>Visualiza los beneficios de dejar de fumar</p>
        </div>

        <div className="feature">
          <FaChartLine className="feature-icon" />
          <h3>Progreso Personal</h3>
          <p>Mide tu avance y motivación</p>
        </div>
      </section>

      <div className="home-cta">
        <Link to="/register" className="cta-button">
          <FaSignInAlt /> Comenzar Ahora
        </Link>
        <Link to="/login" className="secondary-button">
          Ya tengo cuenta
        </Link>
      </div>

      <footer className="home-footer">
        <p>© 2024 Quit Smoking App. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;