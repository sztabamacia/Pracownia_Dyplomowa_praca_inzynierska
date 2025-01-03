import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import predictionService from '../../services/predictionService';
import mushroomService from '../../services/mushroomService'; // Importowanie mushroomService
import '../../styles/prediction.css';
import AuthContext from '../../contexts/AuthContext';


const PredictionPost = () => {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [preview, setPreview] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [mushroomInfo, setMushroomInfo] = useState(null); // Dodanie stanu do przechowywania informacji o grzybie
  const { userID, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);

    if (!isLoggedIn) {
      alert('Nie jesteś zalogowany.');
      navigate('/login');
      return;
    }

  }, [isLoggedIn]);



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

  const handlePredictionClick = async (prediction) => {
    setSelectedPrediction(prediction);
    try {
      const response = await mushroomService.getMushroomByScientificName(prediction[0]);
      setMushroomInfo(response.data);
    } catch (error) {
      console.error('Error fetching mushroom info:', error);
    }
  };

  const closePopup = () => {
    setSelectedPrediction(null);
    setMushroomInfo(null); // Resetowanie informacji o grzybie
  };

  return (
    <div className="whole-prediction">
    <div className="prediction-container">
      <div className="prediction-left">
        <h1>Sprawdź gatunek grzyba</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Udostępnij zdjęcie:</label>
            <input type="file" onChange={handleFileChange} required />
          </div>
          {preview && (
            <div>
              <h2>Podgląd zdjęcia</h2>
              <img src={preview} alt="Preview" />
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="prediction-right">
        {predictions.length > 0 && (
          <div>
            <h2>Wynik</h2>
            <ul>
              {predictions.map((prediction, index) => (
                <li key={index} onClick={() => handlePredictionClick(prediction)}>
                  {prediction[0]}: {prediction[1].toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {selectedPrediction && mushroomInfo && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2>{mushroomInfo.commonName}</h2>
            <p>Pewność: {selectedPrediction[1].toFixed(2)}</p>
            <p>Nazwa naukowa: {mushroomInfo.scientificName}</p>
            <p>Opis: {mushroomInfo.description}</p>
            <p>Jadalność: {mushroomInfo.edibility}</p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default PredictionPost;