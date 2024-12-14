import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import AuthContext from '../../contexts/AuthContext';

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userID, isLoggedIn } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    passwordHash: ''
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('userID:', userID, typeof userID);
    console.log('id:', id, typeof id);

    if (!isLoggedIn) {
      alert('You are not logged in.');
      navigate('/login'); // Przekierowanie na stronę logowania
      return;
    }

    if (userID !== id) {
      navigate(`/users/update/${userID}`); // Przekierowanie na stronę aktualizacji użytkownika
      return;
    }

    const fetchUser = async () => {
      try {
        console.log('Fetching user data...');
        const response = await userService.getUserById(id);
        const { username, email, passwordHash } = response.data;
        setFormData({ username, email, passwordHash });
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate, isLoggedIn, userID]);

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      navigate('/'); // Przekierowanie na stronę główną po zakończeniu ładowania
    }
  }, [isLoading, isAuthorized, navigate]);

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
      navigate(`/users/detail/${id}`); // Przekierowanie na stronę profilu użytkownika
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null; // Nie wyświetlaj nic, jeśli użytkownik nie jest autoryzowany
  }

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