import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import historyService from '../../services/historyService';

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await historyService.getHistoryList();
        setHistoryList(response.data);
      } catch (error) {
        console.error('Error fetching history list:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h1>History List</h1>
      <ul>
        {historyList.map((history) => (
          <li key={history.historyID}>
            <Link to={`/history/${history.historyID}`}>
              {new Date(history.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;