import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MusicList from './pages/MusicList';
import Playlists from './pages/PlaylistList';
import PlaylistCreateEdit from './pages/PlaylistCreate';
import MinhasPlaylists from "./pages/MinhasPlaylists";
import PlaylistDetails from './pages/PlaylistDetails';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/musicas" element={<MusicList />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/add_playlists" element={<PlaylistCreateEdit />} />
                <Route path="/minhas-playlists" element={<MinhasPlaylists />} />
                <Route path="/playlists/:id" element={<PlaylistDetails />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
    