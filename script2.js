let userPokemon = [];
let enemyPokemon = [];
const heroPokemonContainer = document.getElementById("hero-pokemon-container");
const enemyPokemonContainer = document.getElementById(
  "enemy-pokemon-container"
);

async function fetchUserPokemon() {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/6/`);
    const pokemon = await response.json();
    const movesToDisplay = ["mega-punch", "scratch", "swords-dance", "ember"];
    const filteredMoves = pokemon.moves.filter((move) =>
      movesToDisplay.includes(move.move.name)
    );
    userPokemon = {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      health: 50,
      moves: filteredMoves.map((move) => move.move.name),
    };
    displayUserPokemon();
  } catch (error) {
    console.error("Error fetching user's Pokémon:", error);
  }
}

async function fetchEnemyPokemon() {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/3/`);
    const pokemon = await response.json();
    const movesToDisplay = ["cut", "headbutt", "bind", "body-slam"];
    const filteredMoves = pokemon.moves.filter((move) =>
      movesToDisplay.includes(move.move.name)
    );
    enemyPokemon = {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      health: 50,
      moves: filteredMoves.map((move) => move.move.name),
    };
    displayEnemyPokemon();
  } catch (error) {
    console.error("Error fetching enemy Pokémon:", error);
  }
}

async function displayUserPokemon() {
  const pokemonCard = createPokemonCard(userPokemon);
  heroPokemonContainer.appendChild(pokemonCard);
}

async function displayEnemyPokemon() {
  const pokemonCard = createPokemonCard(enemyPokemon);
  enemyPokemonContainer.appendChild(pokemonCard);
}

function createPokemonCard(pokemon) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");

  const pokemonNameElement = document.createElement("h3");
  pokemonNameElement.textContent = pokemon.name;

  const pokemonImageElement = document.createElement("img");
  pokemonImageElement.src = pokemon.sprite;

  const pokemonHealthElement = document.createElement("p");
  pokemonHealthElement.textContent = `HP: ${pokemon.health}/50`;

  const pokemonMovesElement = document.createElement("p");
  pokemonMovesElement.textContent = `Moves: ${pokemon.moves.join(", ")}`;

  pokemonCard.appendChild(pokemonNameElement);
  pokemonCard.appendChild(pokemonImageElement);
  pokemonCard.appendChild(pokemonHealthElement);
  pokemonCard.appendChild(pokemonMovesElement);

  return pokemonCard;
}

fetchUserPokemon();
fetchEnemyPokemon();
