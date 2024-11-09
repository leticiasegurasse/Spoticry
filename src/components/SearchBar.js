import React from 'react';

function SearchBar({ searchQuery, setSearchQuery, sortCriteria, setSortCriteria }) {
    return (
        <div>
            <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
                <option value="name">Nome</option>
                <option value="date">Data de Criação</option>
                <option value="popularity">Popularidade</option>
            </select>
        </div>
    );
}

export default SearchBar;