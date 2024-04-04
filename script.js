const pokemonContainer = document.getElementById("Pk-Container");
const typeSelection = document.getElementById("type-selection");
const typeButtons = document.getElementById("buttons");
let pokemonList;

async function fetchPokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
    const pokemons = await response.json();
    pokemonList = pokemons.results;
    displayPokemons();
  } catch (error) {
    console.error("Error:", error);
  }
}

// Lager en ny fetche funksjon for typer av Pokemon
async function fetchTypes() {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type`);
    const typesData = await response.json();
    const types = typesData.results.map((type) => type.name); //I JSON formatet kan arrayet med objekter mappes for å hente type navn
    return types;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function displayTypes(types) {
  types.forEach((type) => {
    if (isValidType(type)) {
      //API et hadde en unknown type, derfor sjekker jeg funksjonen med validTypes, før jeg lager knappe element
      const button = document.createElement("button");
      button.textContent = type;
      button.style.marginLeft = "10px";
      button.style.borderRadius = "25%";
      button.style.width = "60px";
      button.style.backgroundColor = getTypeColor(type); //Funksjon med switch statement gjør at bakgrunnsfargen samsvarer med typen.
      typeButtons.appendChild(button);
    }
  });
}

function isValidType(type) {
  const validTypes = [
    "grass",
    "fire",
    "water",
    "electric",
    "dark",
    "bug",
    "fairy",
    "dragon",
    "fighting",
    "flying",
    "ghost",
    "ground",
    "ice",
    "normal",
    "poison",
    "psychic",
    "rock",
    "steel",
  ];

  // bruker includes metoden som returnerer kun sanne verdier, altså de som er validTypes
  return validTypes.includes(type);
}

function getTypeColor(type) {
  switch (type) {
    case "grass":
      return "green";
    case "fire":
      return "red";
    case "water":
      return "blue";
    case "electric":
      return "yellow";
    case "dark":
      return "#36454F";
    case "bug":
      return "#AAFF00";
    case "fairy":
      return "pink";
    case "dragon":
      return "#0096FF";
    case "fighting":
      return "orange";
    case "flying":
      return "skyblue";
    case "ghost":
      return "purple";
    case "ground":
      return "#D27D2D";
    case "ice":
      return "white";
    case "normal":
      return "grey";
    case "poison":
      return "purple";
    case "psychic":
      return "#AA336A";
    case "rock":
      return "brown";
    case "steel":
      return "silver";
    case "ghost":
      return "purple";
  }
}

async function displayPokemons() {
  pokemonContainer.innerHTML = ""; // Clear previous Pokémon cards

  pokemonList.forEach(async (pokemon) => {
    const response = await fetch(pokemon.url); // Fetch individuelle pokemon url
    const pokemonData = await response.json();

    const pokemonCard = document.createElement("div");
    const catchPokemon = document.createElement("button");
    const deletePokemon = document.createElement("button");
    const editPokemon = document.createElement("button");

    const pokemonType = pokemonData.types //types er et array som inneholder to objekter, derfor bruker jeg map metoden på det
      .map((type) => type.type.name)
      .join(", ");

    pokemonCard.innerHTML = `<img src=${pokemonData.sprites.front_default} /> <h3>${pokemonData.name}</h3> <p>${pokemonType}</p>`;
    pokemonCard.style.textAlign = "center";
    pokemonContainer.append(pokemonCard);

    catchPokemon.textContent = "Lagre";
    deletePokemon.textContent = "Fjern";
    editPokemon.textContent = "Rediger";

    catchPokemon.style.marginLeft = "5px";
    deletePokemon.style.marginLeft = "5px";
    editPokemon.style.marginLeft = "5px";

    pokemonCard.append(catchPokemon);
    pokemonCard.append(deletePokemon);
    pokemonCard.append(editPokemon);
  });
}

fetchPokemon();
fetchTypes().then((types) => displayTypes(types));
