import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProgress } from '../redux/slices/progressSlice.js';
import { FaChartLine } from 'react-icons/fa';

import '../assets/styles/components/dashboard.scss';

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cigarettesReduced, totalCigarettes, loading, error } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchProgress());
  }, [dispatch]);

  const progressPercentage = totalCigarettes > 0 
    ? (cigarettesReduced / totalCigarettes) * 100 
    : 0;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}</h1>
      
      <div className="progress-section">
        <h2><FaChartLine /> Your Progress</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
        <p>{cigarettesReduced} / {totalCigarettes} cigarettes reduced</p>
      </div>

      <div className="quit-plan">
        <h2>Your Quit Plan</h2>
        <p>Keep going! You're making great progress.</p>
      </div>
    </div>
  );
}

export default Dashboard;