import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MusicList from './pages/MusicList';
import MinhasMusicas from "./pages/MinhasMusicas";
import AddMusic from './pages/AddMusic';
import Playlists from './pages/PlaylistList';
import MinhasPlaylists from "./pages/MinhasPlaylists";
import PlaylistDetails from './pages/PlaylistDetails';
import AddPlaylist from './pages/AddPlaylist';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/musicas" element={<MusicList />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/minhas-playlists" element={<MinhasPlaylists />} />
                <Route path="/minhas-musicas" element={<MinhasMusicas />} />
                <Route path="/playlists/:id" element={<PlaylistDetails />} />
                <Route path="/add-playlist" element={<AddPlaylist />} />
                <Route path="/add-musica" element={<AddMusic />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
    