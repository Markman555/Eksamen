const pokemonContainer = document.getElementById("Pk-Container");
const typesContainer = document.getElementById("types-container");
const allPokemonBtn = document.getElementById("all-pokemon");
let pokemonList = []; // Array til de 50 fetchede pokemon som først displayes
let filteredPokemonList = []; // Array for filtrere pokemon
let savedPokemons = JSON.parse(localStorage.getItem("savedPokemons")) || [];

async function fetchPokemon() {
  try {
    // Kalkulerer offset for å lagre et tilfeldig verdi
    const offset = Math.floor(Math.random() * 1118); // Måtte finne ut hvor mange Pokemon det er i Api'et

    // Manipulere endpoint med limit og offset, for å kun fetche 50, og offset for at det alltid er tilfeldige 50.
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offset}`
    );
    const pokemons = await response.json();
    pokemonList = pokemons.results;
    displayPokemons(pokemonList); // Vis pokemon med dette parameteret
  } catch (error) {
    console.error("Error:", error);
  }
}

//Her fetcher jeg typer pokemon for å få denne informasjonen
async function fetchTypes() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type/");
    const typesData = await response.json();
    const types = typesData.results.map((type) => type.name); //Array må mappes for å få en til to type navn for hver pokemon
    return types;
  } catch (error) {
    console.error("Error fetching Pokémon types:", error);
    return [];
  }
}
//funksjon som opretter knapper for hver pokemon type
async function displayTypes() {
  const types = await fetchTypes();
  types.forEach((type) => {
    if (isValidType(type)) {
      //API et hadde en unknown type, derfor sjekker jeg funksjonen med validTypes, før jeg lager knappe element
      const button = document.createElement("button");
      button.textContent = type;
      button.style.marginLeft = "10px";
      button.style.borderRadius = "25%";
      button.style.width = "60px";
      button.style.backgroundColor = getTypeColor(type); //Funksjon med switch statement gjør at bakgrunnsfargen samsvarer med typen.
      button.addEventListener("click", () => filterPokemonsByType(type)); //kaller funksjonen med parameteret 'type' på knappetrykk
      typesContainer.appendChild(button);
    }
  });
  allPokemonBtn.addEventListener("click", () => displayPokemons(pokemonList));
  document.body.prepend(typesContainer);
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
      return "#99FFFF";
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
//Funksjon å vise pokemon, hvilket blir kalt inne i fetchPokemon
function displayPokemons(pokemons) {
  pokemonContainer.innerHTML = ""; // Tøm tidligere kort

  pokemons.forEach(async (pokemon) => {
    const response = await fetch(pokemon.url); //Hver individuelle pokemon url fetches og gjøres om til JSON format
    const pokemonData = await response.json();

    const pokemonCard = document.createElement("div"); // Lager alle html elementer til kortet
    const primaryType = pokemonData.types[0].type.name; //Henter første typen til Pokemon
    pokemonCard.style.backgroundColor = getTypeColor(primaryType); //Styler bakgrunnsfargen

    const catchPokemon = document.createElement("button");
    const deletePokemon = document.createElement("button");
    const editPokemon = document.createElement("button");

    const pokemonType = pokemonData.types //types må mappes for å displaye
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

    catchPokemon.addEventListener("click", () => {
      savePokemon(pokemonData);
    });
  });
}
//Funksjonalitet til Type knappene
async function filterPokemonsByType(type) {
  filteredPokemonList = []; // Tøm array når du trykker på knappen
  // Bruker for of loop for å iterere gjennom pokemon fra pokemonList
  for (const pokemon of pokemonList) {
    const pokemonTypes = await fetchPokemonTypes(pokemon.url); //Requester url fra hver pokemon som inneholder typer til Pokemon
    if (pokemonTypes.includes(type)) {
      //Hvis pokemon inkluderer typen som blir valgt så pusher jeg inn den pokemon i det filtrerte arrayet.
      filteredPokemonList.push(pokemon);
    }
  }

  displayPokemons(filteredPokemonList);
}
//Må opprette et egen fetche funksjon for at filterPokemonsByType skal fungere
async function fetchPokemonTypes(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pokemonTypes = data.types.map((type) => type.type.name); //går lengre inn i arrayet
    return pokemonTypes;
  } catch (error) {
    console.error("Error fetching Pokémon types:", error);
    return [];
  }
}

function savePokemon(pokemonData) {
  if (savedPokemons.length < 5) { // Check if the limit of 5 saved Pokémon is reached
    savedPokemons.push(pokemonData);
    localStorage.setItem('savedPokemons', JSON.stringify(savedPokemons));
    displaySavedPokemons(); // Update the display of saved Pokémon
  } else {
    alert('You can only save up to 5 Pokémon.');
  }
}

function displaySavedPokemons() {
  const savedPokemonsContainer = document.getElementById("saved-pokemons");
  savedPokemonsContainer.innerHTML = "";

  savedPokemons.forEach((pokemonData) => {
    const savedPokemonCard = document.createElement("div");
    const primaryType = pokemonData.types[0].type.name;
    savedPokemonCard.style.backgroundColor = getTypeColor(primaryType);
    savedPokemonCard.innerHTML = `<img src=${
      pokemonData.sprites.front_default
    } />
                                   <h3>${pokemonData.name}</h3>
                                   <p>${pokemonData.types
                                     .map((type) => type.type.name)
                                     .join(", ")}</p>`;

    savedPokemonsContainer.appendChild(savedPokemonCard);
  });
}

fetchPokemon();
displayTypes();
displaySavedPokemons();
