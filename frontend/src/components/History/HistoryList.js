import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import historyService from '../../services/historyService';

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userID = parseInt(userId, 10); // Konwersja userId na liczbę całkowitą
        const response = await historyService.getHistoryListByUserId(userID);
        console.log('Fetched history list:', response.data); // Dodane logowanie
        if (response.data && response.data.length > 0) {
          setHistoryList(response.data);
        } else {
          console.log('No history found or response is null/undefined');
        }
      } catch (error) {
        console.error('Error fetching history list:', error);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <div>
      <h1>History List</h1>
      {historyList.length > 0 ? (
        <ul>
          {historyList.map((history) => (
            <li key={history.historyID}>
              <p>History ID: {history.historyID}</p>
              <p>User ID: {history.userID}</p>
              <p>Created At: {new Date(history.createdAt).toLocaleString()}</p>
              <p>Mushroom ID 1: {history.mushroomID1}</p>
              <p>Confidence 1: {history.confidence1}</p>
              <p>Mushroom ID 2: {history.mushroomID2}</p>
              <p>Confidence 2: {history.confidence2}</p>
              <p>Mushroom ID 3: {history.mushroomID3}</p>
              <p>Confidence 3: {history.confidence3}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No history found.</p>
      )}
    </div>
  );
};

export default HistoryList;