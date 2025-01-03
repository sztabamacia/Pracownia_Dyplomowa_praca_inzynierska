import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import '../styles/navigation.css';

const Navigation = () => {
  const { isLoggedIn, userID, logout } = useContext(AuthContext);

  return (
    <nav>
      <div className="nav-left">
        <Link to="/">Home</Link>
      </div>
      <ul className="nav-right">
        {isLoggedIn ? (
          <>
            <li><Link to={`/users/detail/${userID}`}>Profil</Link></li>
            <li><Link to={`/history/${userID}`}>Historia</Link></li>
            <li><Link to="/predictions">Predykcja</Link></li>
            <li><button onClick={logout}>Wyloguj</button></li>
          </>
        ) : (
          <>
            <li><Link to="/register">Rejestracja</Link></li>
            <li><Link to="/login">Logowanie</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;