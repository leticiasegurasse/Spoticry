import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MusicList from './pages/MusicList';
import PlaylistList from './pages/PlaylistList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/musicas" element={<MusicList />} />
                <Route path="/playlists" element={<PlaylistList />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
    