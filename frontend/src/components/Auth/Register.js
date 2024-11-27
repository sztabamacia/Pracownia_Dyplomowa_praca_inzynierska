import React, { useState } from 'react';
import authService from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    passwordHash: ''
  });

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
      await authService.register(formData);
      alert('Registration successful');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
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
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;