import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const Navigation = () => {
  const { isLoggedIn, userID, logout } = useContext(AuthContext);

  return (
    <nav>
      <ul>
        {isLoggedIn ? (
          <>
            <li><Link to={`/users/detail/${userID}`}>Profile</Link></li>
            <li><Link to={`/history/${userID}`}>History</Link></li>
            <li><Link to="/predictions">Predictions</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;