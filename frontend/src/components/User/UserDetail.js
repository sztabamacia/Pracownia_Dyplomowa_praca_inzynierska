import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import userService from '../../services/userService';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(id);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Detail</h1>
      <p>User ID: {user.userID}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Created At: {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</p>
      <Link to={`/users/update/${user.userID}`}>Update</Link>
    </div>
  );
};

export default UserDetail;