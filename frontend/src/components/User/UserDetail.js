import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import AuthContext from '../../contexts/AuthContext';
import '../../styles/userDetail.css';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userID, isLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('userID:', userID, typeof userID);
    console.log('id:', id, typeof id);

    if (String(userID) !== String(id)) {
      navigate(`/users/detail/${userID}`); 
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
        console.log('Fetched user:', response.data);
        setUser(response.data);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null; // Nie wyświetlaj nic, jeśli użytkownik nie jest autoryzowany
  }

  return (
  <div className='whole-user-detail'>
    <div className="user-detail-container">
      <h1>Profil Użytkownika</h1>
      {user && (
        <>
          <p>ID użytkownika: {user.userID}</p>
          <p>Nazwa użytkownika: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Konto utworzono: {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</p>
          <Link to={`/users/update/${user.userID}`}>Edytuj</Link>
        </>
      )}
    </div>
  </div>
  );
};

export default UserDetail;