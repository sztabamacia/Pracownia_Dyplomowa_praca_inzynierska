import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import historyService from '../../services/historyService';
import mushroomService from '../../services/mushroomService';
import AuthContext from '../../contexts/AuthContext';
import '../../styles/historyGet.css';

const HistoryGet = () => {
  const { userId, historyId } = useParams();
  const [history, setHistory] = useState(null);
  const [mushroomNames, setMushroomNames] = useState({});
  const [selectedMushroom, setSelectedMushroom] = useState(null);
  const [mushroomInfo, setMushroomInfo] = useState(null);
  const { userID, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (String(userID) !== String(userId)) {
      navigate(`/history/${userID}/history/${historyId}`); 
      return;
    }

    if (!isLoggedIn) {
      alert('Nie jesteś zalogowany.');
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await historyService.getHistoryByUserIdAndHistoryId(userId, historyId);
        setHistory(response.data);

        const mushroomIDs = [
          response.data.mushroomID1,
          response.data.mushroomID2,
          response.data.mushroomID3
        ];
        const names = await Promise.all(mushroomIDs.map(id => mushroomService.getMushroomById(id)));
        const namesMap = names.reduce((acc, mushroom) => {
          acc[mushroom.data.mushroomID] = mushroom.data.commonName;
          return acc;
        }, {});
        setMushroomNames(namesMap);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [userId, historyId, userID, isLoggedIn, navigate]);

  const handleMushroomClick = async (mushroomID) => {
    setSelectedMushroom(mushroomID);
    try {
      const response = await mushroomService.getMushroomById(mushroomID);
      setMushroomInfo(response.data);
    } catch (error) {
      console.error('Error fetching mushroom info:', error);
    }
  };

  const closePopup = () => {
    setSelectedMushroom(null);
    setMushroomInfo(null);
  };

  const handleDelete = async () => {
    try {
      await historyService.deleteHistoryById(historyId);
      alert('Historia została usunięta.');
      navigate(`/history/${userID}`);
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  if (!history) {
    return <div>Loading...</div>;
  }


  return (
    <div className="whole-history-detail">
    <div className="history-detail-container">
      <h1>History Detail</h1>
      <p><span>Utworzono:</span> {new Date(history.createdAt).toLocaleString()}</p>
      <p><span>1:</span> <span onClick={() => handleMushroomClick(history.mushroomID1)}>{mushroomNames[history.mushroomID1]}</span> (Confidence: {history.confidence1.toFixed(2)})</p>
      <p><span>2:</span> <span onClick={() => handleMushroomClick(history.mushroomID2)}>{mushroomNames[history.mushroomID2]}</span> (Confidence: {history.confidence2.toFixed(2)})</p>
      <p><span>3:</span> <span onClick={() => handleMushroomClick(history.mushroomID3)}>{mushroomNames[history.mushroomID3]}</span> (Confidence: {history.confidence3.toFixed(2)})</p>
      <p className='image'><img src={`http://localhost:8000/uploads/${history.file.split('/').pop()}`} alt='Mushroom' /></p>
      <button className="delete-button" onClick={handleDelete}>Usuń historię</button>
      <button type="button" className="cancel" onClick={() => navigate(`/history/${userID}`)}>Wróć</button>
      {selectedMushroom && mushroomInfo && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2>{mushroomInfo.commonName}</h2>
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

export default HistoryGet;