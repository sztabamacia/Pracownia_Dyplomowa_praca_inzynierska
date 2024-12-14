import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import AuthContext from '../../contexts/AuthContext';

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

    if (!isLoggedIn) {
      alert('You are not logged in.');
      navigate('/login'); // Przekierowanie na stronę logowania
      return;
    }

    if (userID !== id) {
      navigate(`/users/detail/${userID}`); // Przekierowanie na stronę szczegółów użytkownika
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
    <div>
      <h1>User Detail</h1>
      {user && (
        <>
          <p>User ID: {user.userID}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Created At: {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</p>
          <Link to={`/users/update/${user.userID}`}>Update</Link>
        </>
      )}
    </div>
  );
};

export default UserDetail;