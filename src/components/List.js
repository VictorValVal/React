import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios';
import '../App.css';

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Crear un objeto ref para cada caja de Pokémon
  const pokemonRefs = useRef([]);

  const typeColors = {
    grass: '#78C850',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878'
  };

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=100')
      .then(async response => {
        const pokemonData = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            const primaryType = details.data.types[0].type.name;
            const gif = details.data.sprites.versions?.['generation-vii']?.['ultra-sun-ultra-moon']?.animated?.front_default ||
                        details.data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default;
            
            return {
              name: pokemon.name,
              image: details.data.sprites.other['official-artwork'].front_default,
              gif,
              types: details.data.types.map(type => type.type.name).join(', '),
              primaryType,
              height: details.data.height,
              weight: details.data.weight,
              stats: details.data.stats.map(stat => ({
                name: stat.stat.name,
                value: stat.base_stat
              }))
            };
          })
        );
        setPokemons(pokemonData);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al obtener los datos.');
        setLoading(false);
      });
  }, []);

  // Agregar la función para desplazarse a la caja correspondiente
  const scrollToPokemon = (pokemonName) => {
    const pokemonIndex = pokemons.findIndex(pokemon => pokemon.name.toLowerCase() === pokemonName.toLowerCase());
    if (pokemonIndex !== -1) {
      pokemonRefs.current[pokemonIndex].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getTypeIconUrl = (type) => {
    try {
      return require(`../components/icons/${type.toLowerCase()}.svg`);
    } catch (error) {
      return null;
    }
  };

  const openModal = (pokemon) => setSelectedPokemon(pokemon);
  const closeModal = () => setSelectedPokemon(null);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="container">
        {pokemons.map((pokemon, index) => (
          <div 
            className="caja" 
            key={index} 
            onClick={() => openModal(pokemon)}
            style={{ 
              backgroundColor: typeColors[pokemon.primaryType] || '#ddd', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              padding: '10px' 
            }}
            ref={el => pokemonRefs.current[index] = el}  // Asignar ref a cada caja
          >
            <div className="pokemon-box">
              <p className="num">#{(index + 1).toString().padStart(4, '0')}</p>
              <div className="pokemon-info-container">
                <div className="pokemon-image-container">
                  <img 
                    src={pokemon.image} 
                    alt={pokemon.name} 
                    width="100" 
                    className="pokemon-image" 
                  />
                </div>
                <div className="pokemon-data">
                  <img 
                    className="typeIcon"
                    src={getTypeIconUrl(pokemon.primaryType)} 
                    alt={pokemon.primaryType} 
                    width="30" 
                    height="30"
                  />
                  <p className="pokemon-name">{pokemon.name.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPokemon && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ backgroundColor: typeColors[selectedPokemon.primaryType] || '#ddd' }}
          >
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
                    {selectedPokemon.types.split(', ').map((type, index) => (
                      <img 
                        className="type-icon" 
                        key={index} 
                        src={getTypeIconUrl(type)} 
                        alt={type} 
                        width="30" 
                        height="30" 
                      />
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

export default PokemonList;
