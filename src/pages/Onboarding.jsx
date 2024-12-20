import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createReductionPlan } from '../redux/slices/reductionPlanSlice';

const Onboarding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Estado para el formulario de plan de reducción
  const [formData, setFormData] = useState({
    startCigarettes: user?.cigarettesPerDay || '', // Valor inicial de cigarrillos por día
    targetCigarettes: '', // Objetivo de reducción
    reductionStrategy: 'gradual', // Estrategia de reducción por defecto
  });

  // Estrategias de reducción predefinidas
  const reductionStrategies = [
    { 
      value: 'gradual', 
      label: 'Reducción Gradual', 
      description: 'Disminuye lentamente el número de cigarrillos' 
    },
    { 
      value: 'rapid', 
      label: 'Reducción Rápida', 
      description: 'Reduce rápidamente el consumo de cigarrillos' 
    },
    { 
      value: 'custom', 
      label: 'Plan Personalizado', 
      description: 'Define tu propio ritmo de reducción' 
    }
  ];

  // Manejador de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Dispatch de la acción para crear el plan de reducción
      const actionResult = await dispatch(createReductionPlan({
        startCigarettes: parseInt(formData.startCigarettes),
        targetCigarettes: parseInt(formData.targetCigarettes),
        reductionStrategy: formData.reductionStrategy
      }));

      // Verificar si la creación del plan fue exitosa
      if (createReductionPlan.fulfilled.match(actionResult)) {
        // Navegar al dashboard o a la siguiente pantalla
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error al crear el plan de reducción:', error);
    }
  };

  return (
    <div className="onboarding-container">
      <h1>Crea tu Plan de Reducción de Cigarrillos</h1>
      
      <form onSubmit={handleSubmit} className="reduction-plan-form">
        <div className="form-group">
          <label htmlFor="startCigarettes">
            Cigarrillos actuales por día
          </label>
          <input
            type="number"
            id="startCigarettes"
            name="startCigarettes"
            value={formData.startCigarettes}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetCigarettes">
            Cigarrillos objetivo por día
          </label>
          <input
            type="number"
            id="targetCigarettes"
            name="targetCigarettes"
            value={formData.targetCigarettes}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reductionStrategy">
            Estrategia de Reducción
          </label>
          <select
            id="reductionStrategy"
            name="reductionStrategy"
            value={formData.reductionStrategy}
            onChange={handleChange}
            required
          >
            {reductionStrategies.map((strategy) => (
              <option key={strategy.value} value={strategy.value}>
                {strategy.label}
              </option>
            ))}
          </select>
        </div>

        <div className="strategy-description">
          {reductionStrategies.find(
            strategy => strategy.value === formData.reductionStrategy
          )?.description}
        </div>

        <button type="submit" className="submit-btn">
          Crear Plan de Reducción
        </button>
      </form>
    </div>
  );
};

export default Onboarding;