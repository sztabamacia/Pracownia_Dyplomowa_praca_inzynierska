import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/Home';
import HistoryList from './components/History/HistoryList';
import HistoryGet from './components/History/HistoryGet';
import MushroomList from './components/Mushroom/MushroomList';
import MushroomDetail from './components/Mushroom/MushroomDetail';
import MushroomCreate from './components/Mushroom/MushroomCreate';
import UserList from './components/User/UserList';
import UserUpdate from './components/User/UserUpdate';
import UserDetail from './components/User/UserDetail';
import PredictionPost from './components/Prediction/PredictionPost';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<HistoryList />} />
            <Route path="/history/:id" element={<HistoryGet />} />
            <Route path="/mushrooms" element={<MushroomList />} />
            <Route path="/mushrooms/create" element={<MushroomCreate />} />
            <Route path="/mushrooms/:id" element={<MushroomDetail />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserUpdate />} />
            <Route path="/users/detail/:id" element={<UserDetail />} />
            <Route path="/predictions" element={<PredictionPost />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;