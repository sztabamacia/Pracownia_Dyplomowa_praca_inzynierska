import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import AuthContext from '../../contexts/AuthContext';
import '../../styles/userUpdate.css'; // Importowanie pliku CSS

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userID, isLoggedIn } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    passwordHash: '',
    passwordHashRepeat: ''
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('userID:', userID, typeof userID);
    console.log('id:', id, typeof id);

    if (String(userID) !== String(id)) {
      navigate(`/users/update/${userID}`); 
      return;
    }

    if (!isLoggedIn) {
      alert('Nie jesteś zalogowany.');
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        console.log('Fetching user data...');
        const response = await userService.getUserById(id);
        const { username, email } = response.data;
        setFormData({ username, email, passwordHash: '', passwordHashRepeat: '' });
        console.log(formData.passwordHash);
        console.log(formData.passwordHashRepeat);
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
      navigate('/');
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
    if (formData.passwordHash !== formData.passwordHashRepeat) {
      console.log(formData.passwordHash);
      console.log(formData.passwordHashRepeat);
      alert('Hasła nie są takie same.');
      return;
    }
    try {
      const { passwordHashRepeat, ...dataToSubmit } = formData; 
      await userService.updateUser(id, dataToSubmit);
      alert('Dane użytkownika zostały zaktualizowane.');
      navigate(`/users/detail/${id}`);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Dane użytkownika nie zostały zaktualizowane.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className='whole-user-update'>
      <div className="user-update-form">
        <h1>Edytuj dane</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nazwa użytkownika:</label>
            <input
              type="text"
              name="username"
              placeholder='Nowa nazwa użytkownika'
              onChange={handleChange}
              maxLength={20}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder='Nowy email'
              onChange={handleChange}
              maxLength={20}
            />
          </div>
          <div>
            <label>Nowe hasło:</label>
            <input
              type="password"
              name="passwordHash"
              placeholder='Nowe hasło'
              onChange={handleChange}
              maxLength={20}
            />
          </div>
          <div>
            <label>Powtórz nowe hasło:</label>
            <input
              type="password"
              name="passwordHashRepeat"
              placeholder='Powtórz nowe hasło'
              onChange={handleChange}
              maxLength={20}
            />
          </div>
          <button type="submit">Edytuj</button>
          <button
            type="button"
            className='cancel'
            onClick={() => navigate(`/users/detail/${id}`)}
          >
            Wróć
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdate;