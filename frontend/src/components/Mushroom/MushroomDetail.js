import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import mushroomService from '../../services/mushroomService';

const MushroomDetail = () => {
  const { id } = useParams();
  const [mushroom, setMushroom] = useState(null);

  useEffect(() => {
    const fetchMushroom = async () => {
      try {
        const response = await mushroomService.getMushroomById(id);
        setMushroom(response.data);
      } catch (error) {
        console.error('Error fetching mushroom:', error);
      }
    };

    fetchMushroom();
  }, [id]);

  if (!mushroom) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{mushroom.commonName}</h1>
      <p>Scientific Name: {mushroom.scientificName}</p>
      <p>Description: {mushroom.description}</p>
      <p>Edibility: {mushroom.edibility}</p>
    </div>
  );
};

export default MushroomDetail;