import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import historyService from '../../services/historyService';
import mushroomService from '../../services/mushroomService';
import AuthContext from '../../contexts/AuthContext';
import '../../styles/historyList.css';

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  const [mushroomNames, setMushroomNames] = useState({});
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userID, isLoggedIn } = useContext(AuthContext);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('userID:', userID, typeof userID);
    console.log('userId:', userId, typeof userId);

    if (String(userID) !== String(userId)) {
      navigate(`/history/${userID}`); 
      return;
    }

    if (!isLoggedIn) {
      alert('Nie jesteś zalogowany.');
      navigate('/login'); // Przekierowanie na stronę logowania
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await historyService.getHistoryListByUserId(userID);
        console.log('Fetched history list:', response.data); // Dodane logowanie
        if (response.data) {
          setHistoryList(response.data);

          const mushroomIDs = response.data.flatMap(history => [
            history.mushroomID1,
            history.mushroomID2,
            history.mushroomID3
          ]);
          const uniqueMushroomIDs = [...new Set(mushroomIDs)];
          const names = await Promise.all(uniqueMushroomIDs.map(id => mushroomService.getMushroomById(id)));
          const namesMap = names.reduce((acc, mushroom) => {
            acc[mushroom.data.mushroomID] = mushroom.data.commonName;
            return acc;
          }, {});
          setMushroomNames(namesMap);
        } else {
          console.log('No history found or response is null/undefined');
        }
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error fetching history list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId, userID, isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      navigate('/');
    }
  }, [isLoading, isAuthorized, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className='whole-history-list'>
      <h1>History List</h1>
      <div className="history-list-container">
        {historyList.length > 0 ? (
          historyList.map((history) => (
            <div key={history.historyID} className="history-item">
              <Link to={`/history/${userID}/history/${history.historyID}`}>
                <img src={`http://localhost:8000/uploads/${history.file.split('/').pop()}`} alt={`Mushroom ID: ${history.historyID}`} className="history-image" />
                <p>Prediction 1: {mushroomNames[history.mushroomID1]}</p>
                <p>Prediction 2: {mushroomNames[history.mushroomID2]}</p>
                <p>Prediction 3: {mushroomNames[history.mushroomID3]}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No history found.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryList;