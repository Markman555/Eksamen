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
    const movesToDisplay = [
      "dragon-breath",
      "slash",
      "swords-dance",
      "inferno",
    ];
    const filteredMoves = pokemon.moves.filter((move) =>
      movesToDisplay.includes(move.move.name)
    );
    const types = pokemon.types.map((type) => type.type.name);

    const movesWithDamage = filteredMoves.map((move) => {
      let damage = 0;
      let type = "";
      switch (move.move.name) {
        case "dragon-breath":
          damage = 15;
          type = "dragon";
          break;
        case "slash":
          damage = 10;
          type = "normal";
          break;
        case "swords-dance":
          damage = "+5";
          type = "normal";
          break;
        case "inferno":
          damage = 12;
          type = "fire";
          break;
      }
      return { name: move.move.name, damage: damage, type: type };
    });

    userPokemon = {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      health: 120,
      moves: movesWithDamage,
      types: types,
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
    const movesToDisplay = ["poison-powder", "power-whip", "bind", "body-slam"];
    const filteredMoves = pokemon.moves.filter((move) =>
      movesToDisplay.includes(move.move.name)
    );
    const types = pokemon.types.map((type) => type.type.name);

    const movesWithDamage = filteredMoves.map((move) => {
      let damage = 0;
      let type = "";
      switch (move.move.name) {
        case "poison-powder":
          damage = "";
          type = "poison";
          break;
        case "power-whip":
          damage = 15;
          type = "grass";
          break;
        case "body-slam":
          damage = 17;
          type = "normal";
          break;
        case "bind":
          damage = 3;
          type = "normal";
          break;
      }
      return { name: move.move.name, damage: damage, type: type };
    });

    enemyPokemon = {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      health: 120,
      moves: movesWithDamage,
      types: types,
    };
    displayEnemyPokemon();
  } catch (error) {
    console.error("Error fetching enemy Pokémon:", error);
  }
}

async function displayUserPokemon() {
  const pokemonCard = createPokemonCard(userPokemon, true); //sjekker om isUser er true for å håndtere bruker Pokemon annerledes
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

  const pokemonTypesElement = document.createElement("p");
  pokemonTypesElement.textContent = `Type: ${pokemon.types.join(", ")}`;

  if (isUser) {
    pokemonHealthElement.textContent = `HP: ${pokemon.health}/120`;
    userHealthElement = pokemonHealthElement;
  } else {
    pokemonHealthElement.textContent = `HP: ${pokemon.health}/120`;
    enemyHealthElement = pokemonHealthElement;
  }

  const pokemonMovesElement = document.createElement("div");

  if (isUser) {
    pokemon.moves.forEach((move) => {
      const moveButton = document.createElement("button");
      moveButton.textContent = `${move.name}`;
      moveButton.style.marginRight = "5px";
      moveButton.addEventListener("click", () => {
        selectedPokemonMove(move.name, move.damage, move.type);
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
  pokemonCard.appendChild(pokemonTypesElement);

  return pokemonCard;
}

function selectedPokemonMove(moveName, damage, moveType) {
  if (typeof damage === "string") {
    handleNonDamagingMove(moveName);
  } else {
    handleDamagingMove(moveName, damage, moveType);
    console.log("Move Type:", moveType);
  }
  // Sørg for enemy ikke angriper hvis health er mindre enn 0, og at det ikke viser - i health
  if (enemyPokemon.health <= 0) {
    alert(`${enemyPokemon.name} fainted!`);
    enemyHealthElement.textContent = `HP: 0/120`;
  } else {
    performEnemyAttack();
  }
}

function handleNonDamagingMove(moveName) {
  // swords-dance skal gi damage buff
  if (moveName === "swords-dance") {
    // Damge buff på +5 til alle moves
    userPokemon.moves.forEach((move) => {
      if (move.name !== "swords-dance") {
        move.damage += 5;
      }
    });
    alert(`${userPokemon.name} increased attack stats!`);
  }
}

function handleDamagingMove(moveName, damage, moveType) {
  const damageDealt = parseInt(damage);
  const enemyType = enemyPokemon.types[0]; // hent typen til enemy for å passere som parameter
  const moveEffectiveness = getMoveEffectiveness(moveType, enemyType);

  let finalDamage = damageDealt;
  alert(`${userPokemon.name} used ${moveName} on Venusaur!`);
  // super effective angrep gir ekstra
  if (moveEffectiveness === "super-effective") {
    finalDamage += 8;
    alert("It was Super effective!");
  }
  alert(`Venusaur took ${finalDamage} damage`);
  // Oppdater health for enemy
  enemyPokemon.health -= finalDamage;
  enemyHealthElement.textContent = `HP: ${enemyPokemon.health}/120`;
}

function getMoveEffectiveness(moveType, enemyType) {
  // Definerer type matchup, kan legge til mer her hvis det var flere pokemon
  const typeMatchups = {
    fire: {
      grass: "super-effective",
    },
    grass: {
      fire: "not very effective",
    },
  };
  if (typeMatchups[moveType]?.[enemyType] === "super-effective") {
    return "super-effective";
  } else if (typeMatchups[moveType]?.[enemyType] === "not very effective") {
    return "not very effective";
  } else {
    return "normal";
  }
}

function getMoveEffectivenessAgainstUser(moveType, userType) {
  // Define type matchups
  const typeMatchups = {
    grass: {
      fire: "not very effective",
    },
  };
  console.log("Move Type:", moveType);
  console.log("User Type:", userType);
  if (typeMatchups[moveType]?.[userType] === "super-effective") {
    return "super-effective against user";
  } else if (typeMatchups[moveType]?.[userType] === "not very effective") {
    return "not very effective against user";
  } else {
    return "normal";
  }
}

let userIsPoisoned = false;
function performEnemyAttack() {
  // Enemy gjør random move
  const randomMoveIndex = Math.floor(Math.random() * enemyPokemon.moves.length);
  const enemyMove = enemyPokemon.moves[randomMoveIndex];
  let counterDamage = parseInt(enemyMove.damage); // counter damage må være let for at verdien skal endres
  const moveType = enemyMove.type;
  const userType = Array.isArray(userPokemon.types)
    ? userPokemon.types[0]
    : userPokemon.types;
  const moveEffectivenessAgainstUser = getMoveEffectivenessAgainstUser(
    moveType,
    userType
  );

  if (userIsPoisoned) {
    userPokemon.health -= 5;
    userHealthElement.textContent = `HP: ${userPokemon.health}/120`;
    alert(`${userPokemon.name} is poisoned and takes 5 damage!`);
  }
  if (enemyMove.name === "poison-powder") {
    userIsPoisoned = true;
    alert(
      `${enemyPokemon.name} used ${enemyMove.name}, ${userPokemon.name} is poisoned!`
    );
  } else {
    alert(`${enemyPokemon.name} used ${enemyMove.name} on Charizard!`);
    if (moveEffectivenessAgainstUser === "not very effective against user") {
      counterDamage -= 5; // Reduce damage by 5 if the move is not very effective
      alert("It was not very effective");
    }
    alert(`Charizard took ${counterDamage} damage`);
    userPokemon.health -= counterDamage;
    userHealthElement.textContent = `HP: ${userPokemon.health}/120`;
  }

  // Sjekk om userPokemon har health lik eller under 0
  if (userPokemon.health <= 0) {
    alert(`${userPokemon.name} fainted!`);
    userHealthElement.textContent = `HP: 0/120`;
  }
}

fetchUserPokemon();
fetchEnemyPokemon();
