import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ isLoggedIn }) => {
    const userId = localStorage.getItem('userID');

    return (
        <nav>
            <ul>
                {isLoggedIn ? (
                    <>
                        <li><Link to={`/users/${userId}`}>Profil</Link></li>
                        <li><Link to={`/history/${userId}`}>Historia</Link></li>
                        <li><Link to="/predictions">Predyktor</Link></li>
                    </>
                ) : (
                    <li><Link to="/login">Logowanie</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;