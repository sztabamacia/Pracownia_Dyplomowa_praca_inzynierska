import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import AuthContext from '../../contexts/AuthContext';
import '../../styles/login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    passwordHash: ''
  });
  const navigate = useNavigate();
  const { login, userID, isLoggedIn } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(formData);
      login(response.access_token); // Ustaw stan logowania
      alert('Login successful');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed');
    }
  };

  useEffect(() => {
    if (isLoggedIn && userID) {
      navigate(`/users/detail/${userID}`);
    }
  }, [isLoggedIn, userID, navigate]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="passwordHash"
            value={formData.passwordHash}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;