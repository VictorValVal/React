import React, { useState } from 'react';
import axios from 'axios';
import lupa from './img/lupa.png';
import '../App.css';

function PokemonSearch() {
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const typeColors = {
    grass: '#78C850', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
    ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
    flying: '#A890F0', psychic: '#F85888', bug: '#A8B820', rock: '#B8A038',
    ghost: '#705898', dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0',
    fairy: '#EE99AC', normal: '#A8A878'
  };

  function fetchPokemon() {
    setError('');
    axios.get(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`)
      .then(response => {
        setPokemon({
          id: response.data.id,
          name: response.data.name,
          image: response.data.sprites.other['official-artwork'].front_default,
          gif: response.data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default,
          types: response.data.types.map(t => t.type.name),
          primaryType: response.data.types[0].type.name,
          height: response.data.height,
          weight: response.data.weight,
          stats: response.data.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat
          }))
        });
      })
      .catch(() => setError('Pokémon no encontrado.'));
  }

  const getTypeIconUrl = (type) => {
    try {
      return require(`../components/icons/${type.toLowerCase()}.svg`);
    } catch {
      return null;
    }
  };

  const openModal = (pokemon) => setSelectedPokemon(pokemon);
  const closeModal = () => setSelectedPokemon(null);

  return (
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-button" onClick={fetchPokemon}>
          <img className="search-icon" src={lupa} alt="Buscar" />
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {pokemon && (
        <div className='caja' 
          style={{ backgroundColor: typeColors[pokemon.primaryType] || '#ddd', position: 'relative', zIndex: 3 }}
          onClick={() => openModal(pokemon)}>
          <div className="pokemon-box">
            <p className='num'>#{String(pokemon.id).padStart(4, '0')}</p>
            <div className="pokemon-info-container2">
              <div className="pokemon-image-container">
                <img src={pokemon.image} alt={pokemon.name} width="100" className="pokemon-image" />
              </div>
              <div className="pokemon-data">
                <div className="type-icons">
                  {pokemon.types.map((type, index) => (
                    <img key={index} src={getTypeIconUrl(type)} alt={type} width="30" height="30" />
                  ))}
                </div>
                <p className='pokemon-name'>{pokemon.name.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPokemon && (
        <div className="modal-overlay" onClick={closeModal} style={{ position: 'fixed', zIndex: 2000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} 
            style={{ backgroundColor: typeColors[selectedPokemon.primaryType] || '#ddd' }}>
            <button className="close-button" onClick={closeModal}>X</button>
            <div className="modal-container">
            <div className="modal-left">
                <div className="nombre-container">
                  <h2 className="nombre-modal">{selectedPokemon.name.toUpperCase()}</h2>
                </div>
                <div className="gif-container">
                  {selectedPokemon.gif && <img src={selectedPokemon.gif} alt="Gif" width="120" />}
                </div>
              </div>
              <div className="modal-right">
                <div className="infoT">
                  <p className="textInfo">TIPOS</p>
                  <div className="type-icons">
                    {selectedPokemon.types.map((type, index) => (
                      <img key={index} src={getTypeIconUrl(type)} alt={type} width="30" height="30" />
                    ))}
                  </div>
                </div>
                <div className="infoAP">
                  <p className="textInfo">
                    ALTURA <span className="textInfo2">{selectedPokemon.height / 10} m</span>
                  </p> 
                  <p className="textInfo">
                    PESO <span className="textInfo2">{selectedPokemon.weight / 10} kg</span>
                  </p> 
                </div>
                <div className="infoStats">
                  <div className="stats-column left">
                    {selectedPokemon.stats.slice(0, 3).map((stat, index) => (
                      <div key={`left-${index}`} className="stat">
                        <p className="textInfo3">
                          {stat.name.toUpperCase()} <span className="textInfo4">{stat.value}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="stats-column right">
                    {selectedPokemon.stats.slice(3, 6).map((stat, index) => (
                      <div key={`right-${index}`} className="stat">
                        <p className="textInfo3">
                          {stat.name.toUpperCase()} <span className="textInfo4">{stat.value}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonSearch;
