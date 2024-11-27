import React, { useState } from 'react';
import mushroomService from '../../services/mushroomService';

const MushroomCreate = () => {
  const [formData, setFormData] = useState({
    commonName: '',
    scientificName: '',
    description: '',
    edibility: ''
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
      await mushroomService.createMushroom(formData);
      alert('Mushroom created successfully');
    } catch (error) {
      console.error('Error creating mushroom:', error);
      alert('Failed to create mushroom');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Common Name:</label>
        <input
          type="text"
          name="commonName"
          value={formData.commonName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Scientific Name:</label>
        <input
          type="text"
          name="scientificName"
          value={formData.scientificName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Edibility:</label>
        <input
          type="text"
          name="edibility"
          value={formData.edibility}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Mushroom</button>
    </form>
  );
};

export default MushroomCreate;