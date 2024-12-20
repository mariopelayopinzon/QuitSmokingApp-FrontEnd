import React from 'react'; 
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { logout } from '../../redux/slices/authSlice'; 
import { FaHome, FaChartLine, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useNavigate  } from 'react-router-dom';

import '../../assets/styles/components/_navbar.scss';

function Navbar() { 
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async() => {
    dispatch(logout());
    navigate("/login")
  }; 
  
  return( 
    <nav className='navbar'>
      <div className='navbar-brand'>
        <Link to="/">Quit Smoking App</Link>
      </div>
      <div className='navbar-menu'>
        <Link to="/" className='nav-bar-item'>
        <FaHome/> 
        </Link>

        { isAuthenticated ? (
          <>
            <Link to="/dashboard" className="navbar-item">
              <FaChartLine /> Dashboard
            </Link>
            <Link to="/progress" className="navbar-item">
              <FaChartLine /> Progress
            </Link>
            <button onClick={handleLogout} className="navbar-item logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">
              <FaSignInAlt /> Login
            </Link>
            <Link to="/register" className="navbar-item">
              <FaUserPlus /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;