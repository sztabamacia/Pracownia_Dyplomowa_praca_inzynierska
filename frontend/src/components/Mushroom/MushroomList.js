import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import mushroomService from '../../services/mushroomService';

const MushroomList = () => {
  const [mushrooms, setMushrooms] = useState([]);

  useEffect(() => {
    const fetchMushrooms = async () => {
      try {
        const response = await mushroomService.getMushroomList();
        setMushrooms(response.data);
      } catch (error) {
        console.error('Error fetching mushrooms:', error);
      }
    };

    fetchMushrooms();
  }, []);

  return (
    <div>
      <h1>Mushroom List</h1>
      <ul>
        {mushrooms.map((mushroom) => (
          <li key={mushroom.mushroomID}>
            <Link to={`/mushrooms/${mushroom.mushroomID}`}>
              {mushroom.commonName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MushroomList;