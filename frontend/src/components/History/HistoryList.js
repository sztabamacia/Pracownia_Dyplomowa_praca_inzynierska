import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import historyService from '../../services/historyService';

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await historyService.getHistoryListByUserId(userId);
        setHistoryList(response.data);
      } catch (error) {
        console.error('Error fetching history list:', error);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <div>
      <h1>History List</h1>
      <ul>
        {historyList.map(history => (
          <li key={history.historyID}>
            <Link to={`/history/${userId}/history/${history.historyID}`}>History ID: {history.historyID}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;