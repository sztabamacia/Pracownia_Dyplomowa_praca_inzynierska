import React, { useState } from 'react';
import predictionService from '../../services/predictionService';

const PredictionPost = () => {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await predictionService.postPrediction(formData);
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  return (
    <div>
      <h1>Make a Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload File:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        {preview && (
          <div>
            <h2>Image Preview</h2>
            <img src={preview} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px' }} />
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
      {predictions.length > 0 && (
        <div>
          <h2>Predictions</h2>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>
                {prediction[0]}: {prediction[1].toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionPost;