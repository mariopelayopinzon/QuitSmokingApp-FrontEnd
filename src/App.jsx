import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/common/Navbar.jsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Progress from './pages/Progress';
import Dashboard from './pages/Dashboard.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';

import './assets/styles/main.scss';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <PrivateRoute>
                <Progress />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;