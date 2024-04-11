let userPokemon = {};
let enemyPokemon = {};
const heroPokemonContainer = document.getElementById("hero-pokemon-container");
const enemyPokemonContainer = document.getElementById(
  "enemy-pokemon-container"
);
let enemyHealthElement;
let userHealthElement;

//Legg til cries fra JSON for å gi pokemonene lyd. og fiks damage buffs

async function fetchUserPokemon() {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/6/`);
    const pokemon = await response.json();
    const movesToDisplay = ["mega-punch", "scratch", "swords-dance", "ember"];
    const filteredMoves = pokemon.moves.filter((move) =>
      movesToDisplay.includes(move.move.name)
    );

    const movesWithDamage = filteredMoves.map((move) => {
      let damage = 0;
      switch (move.move.name) {
        case "mega-punch":
          damage = 15;
          break;
        case "scratch":
          damage = 10;
          break;
        case "swords-dance":
          damage = "+5"; 
          break;
        case "ember":
          damage = 8;
          break;
      }
      return { name: move.move.name, damage: damage };
    });

    userPokemon = {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      health: 50,
      moves: movesWithDamage,
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

    const movesWithDamage = filteredMoves.map((move) => {
      let damage = 0;
      switch (move.move.name) {
        case "cut":
          damage = 5;
          break;
        case "headbutt":
          damage = 7;
          break;
        case "body-slam":
          damage = 10;
          break;
        case "bind":
          damage = 3;
          break;
      }
      return { name: move.move.name, damage: damage };
    });

    enemyPokemon = {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      health: 50,
      moves: movesWithDamage,
    };
    displayEnemyPokemon();
  } catch (error) {
    console.error("Error fetching enemy Pokémon:", error);
  }
}

async function displayUserPokemon() {
  const pokemonCard = createPokemonCard(userPokemon, true);
  heroPokemonContainer.appendChild(pokemonCard);
}

async function displayEnemyPokemon() {
  const pokemonCard = createPokemonCard(enemyPokemon, false);
  enemyPokemonContainer.appendChild(pokemonCard);
}

function createPokemonCard(pokemon, isUser) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");

  const pokemonNameElement = document.createElement("h3");
  pokemonNameElement.textContent = pokemon.name;

  const pokemonImageElement = document.createElement("img");
  pokemonImageElement.src = pokemon.sprite;

  const pokemonHealthElement = document.createElement("p");

  if (isUser) {
    pokemonHealthElement.textContent = `HP: ${pokemon.health}/50`;
    userHealthElement = pokemonHealthElement;
  } else {
    pokemonHealthElement.textContent = `HP: ${pokemon.health}/50`;
    enemyHealthElement = pokemonHealthElement;
  }

  const pokemonMovesElement = document.createElement("div");

  if (isUser) {
    pokemon.moves.forEach((move) => {
      const moveButton = document.createElement("button");
      moveButton.textContent = `${move.name} (${move.damage} dmg)`;
      moveButton.style.marginRight = "5px"; 
      moveButton.addEventListener("click", () => {
        selectedPokemonMove(move.name, move.damage);
      });
      pokemonMovesElement.appendChild(moveButton);
    });
  } else {
    const movesListElement = document.createElement("p");
    const movesWithDamage = pokemon.moves.map(
      (move) => `${move.name} (${move.damage} dmg)`
    );
    movesListElement.textContent = `Moves: ${movesWithDamage.join(", ")}`;
    pokemonMovesElement.appendChild(movesListElement);
  }

  pokemonCard.appendChild(pokemonNameElement);
  pokemonCard.appendChild(pokemonImageElement);
  pokemonCard.appendChild(pokemonHealthElement);
  pokemonCard.appendChild(pokemonMovesElement);

  return pokemonCard;
}

function selectedPokemonMove(moveName, damage) {

    damageDealt = parseInt(damage);
  

  enemyPokemon.health -= damageDealt;

  if (enemyHealthElement) {
    enemyHealthElement.textContent = `HP: ${enemyPokemon.health}/50`;
  } else {
    console.error("Enemy health element not found.");
  }

  alert(
    `${userPokemon.name} used ${moveName} and dealt ${damageDealt} damage!`
  );

  if (enemyPokemon.health <= 0) {
    alert(`${enemyPokemon.name} fainted!`);
  } else {

    const randomMoveIndex = Math.floor(
      Math.random() * enemyPokemon.moves.length
    );
    const enemyMove = enemyPokemon.moves[randomMoveIndex];
    let counterDamage = 0;
    if (enemyMove.damage === "+5") {
      counterDamage = 5;
    } else {
      counterDamage = parseInt(enemyMove.damage);
    }

    userPokemon.health -= counterDamage;

    if (userHealthElement) {
      userHealthElement.textContent = `HP: ${userPokemon.health}/50`;
    } else {
      console.error("User health element not found.");
    }

    alert(
      `${enemyPokemon.name} used ${enemyMove.name} and dealt ${counterDamage} damage!`
    );

    if (userPokemon.health <= 0) {
      alert(`${userPokemon.name} fainted!`);
    }
  }
}
fetchUserPokemon();
fetchEnemyPokemon();
