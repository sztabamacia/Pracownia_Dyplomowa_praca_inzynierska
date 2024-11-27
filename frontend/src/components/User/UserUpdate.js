import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../../services/userService';

const UserUpdate = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    passwordHash: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(id);
        const { username, email, passwordHash } = response.data;
        setFormData({ username, email, passwordHash });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

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
      await userService.updateUser(id, formData);
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
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
      <button type="submit">Update User</button>
    </form>
  );
};

export default UserUpdate;