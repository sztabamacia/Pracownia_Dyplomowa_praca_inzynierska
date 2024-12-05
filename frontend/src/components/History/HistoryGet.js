import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import historyService from '../../services/historyService';

const HistoryGet = () => {
  const { userId, historyId } = useParams();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await historyService.getHistoryByUserIdAndHistoryId(userId, historyId);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [userId, historyId]);

  if (!history) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>History Detail</h1>
      <p>History ID: {history.historyID}</p>
      <p>User ID: {history.userID}</p>
      <p>Created At: {new Date(history.createdAt).toLocaleString()}</p>
      <p>Mushroom ID 1: {history.mushroomID1} (Confidence: {history.confidence1})</p>
      <p>Mushroom ID 2: {history.mushroomID2} (Confidence: {history.confidence2})</p>
      <p>Mushroom ID 3: {history.mushroomID3} (Confidence: {history.confidence3})</p>
      <p>File: {history.file}</p>
    </div>
  );
};

export default HistoryGet;