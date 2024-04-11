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
          damage = 8;
          break;
        case "headbutt":
          damage = 13;
          break;
        case "body-slam":
          damage = 17;
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
      moveButton.textContent = `${move.name}`;
      moveButton.style.marginRight = "5px";
      moveButton.addEventListener("click", () => {
        selectedPokemonMove(move.name, move.damage);
      });
      pokemonMovesElement.appendChild(moveButton);
    });
  } else {
    const movesListElement = document.createElement("p");
    const movesWithDamage = pokemon.moves.map((move) => `${move.name}`);
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
  // swords-dance skal gi damage buff
  if (moveName === "swords-dance") {
    // Damge buff på +5 til alle moves
    userPokemon.moves.forEach((move) => {
      if (move.name !== "swords-dance") {
        move.damage += 5;
      }
    });
    alert(`${userPokemon.name} increased attack stats!`);
    // Enemy gjør random move
    const randomMoveIndex = Math.floor(
      Math.random() * enemyPokemon.moves.length
    );
    const enemyMove = enemyPokemon.moves[randomMoveIndex];
    let counterDamage = parseInt(enemyMove.damage);

    // userPokemon skal ta counterDamage
    userPokemon.health -= counterDamage;
    userHealthElement.textContent = `HP: ${userPokemon.health}/50`;

    alert(
      `${enemyPokemon.name} used ${enemyMove.name} and dealt ${counterDamage} damage!`
    );

    // Sjekk om userPokemon har health lik eller under 0
    if (userPokemon.health <= 0) {
      alert(`${userPokemon.name} fainted!`);
    }
  } else {
    // start damageDealt på 0
    let damageDealt = 0;

    if (typeof damage === "string") {
      damageDealt = 0;
    } else {
      damageDealt = parseInt(damage);

      // Gi damage til enemy
      enemyPokemon.health -= damageDealt;

      // Oppdater UI
      enemyHealthElement.textContent = `HP: ${enemyPokemon.health}/50`;

      alert(
        `${userPokemon.name} used ${moveName} and dealt ${damageDealt} damage!`
      );

      // Sjekk om enemy health er mindre eller lik 0
      if (enemyPokemon.health <= 0) {
        alert(`${enemyPokemon.name} fainted!`);
        enemyHealthElement.textContent = `HP: 0/50`;
      } else {
        // Enemy gjør random move
        const randomMoveIndex = Math.floor(
          Math.random() * enemyPokemon.moves.length
        );
        const enemyMove = enemyPokemon.moves[randomMoveIndex];
        let counterDamage = 0;
        counterDamage = parseInt(enemyMove.damage);

        // userPokemon skal ta damage
        userPokemon.health -= counterDamage;

        // Oppdater UI
        userHealthElement.textContent = `HP: ${userPokemon.health}/50`;

        alert(
          `${enemyPokemon.name} used ${enemyMove.name} and dealt ${counterDamage} damage!`
        );

        // Sjekk om userPokemon har health lik eller under 0
        if (userPokemon.health <= 0) {
          alert(`${userPokemon.name} fainted!`);
        }
      }
    }
  }
}

fetchUserPokemon();
fetchEnemyPokemon();
