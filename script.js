const pokemonContainer = document.getElementById("Pk-Container");
const typesContainer = document.getElementById("types-container");
const allPokemonBtn = document.getElementById("all-pokemon");
const createNewPokemon = document.getElementById("create-pokemon");
let pokemonList = []; // Array til de 50 fetchede pokemon som først displayes
let filteredPokemonList = []; // Array for filtrere pokemon
let savedPokemons = JSON.parse(localStorage.getItem("savedPokemons")) || []; //Hent savedPokemons fra localstorage

async function fetchPokemon() {
  try {
    // Kalkulerer offset for å lagre et tilfeldig verdi
    const offset = Math.floor(Math.random() * 151);

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
    pokemonCard.dataset.name = pokemonData.name;
    pokemonCard.dataset.url = pokemonData.species.url; //Bruker dataset attribute, url er inne i species objektet.

    const catchPokemonBtn = document.createElement("button");
    const deletePokemonBtn = document.createElement("button");
    const editPokemonBtn = document.createElement("button");

    const pokemonType = pokemonData.types //types må mappes for å displaye
      .map((type) => type.type.name)
      .join(", ");

    pokemonCard.innerHTML = `<img src=${pokemonData.sprites.front_default} /> <h3>${pokemonData.name}</h3> <p>${pokemonType}</p>`;
    pokemonCard.style.textAlign = "center";
    pokemonCard.style.width = "180px";
    pokemonContainer.append(pokemonCard);

    catchPokemonBtn.textContent = "Lagre";
    deletePokemonBtn.textContent = "Fjern";
    editPokemonBtn.textContent = "Rediger";

    catchPokemonBtn.style.marginLeft = "5px";
    deletePokemonBtn.style.marginLeft = "5px";
    editPokemonBtn.style.marginLeft = "5px";

    pokemonCard.append(catchPokemonBtn);
    pokemonCard.append(deletePokemonBtn);
    pokemonCard.append(editPokemonBtn);

    catchPokemonBtn.addEventListener("click", () => {
      //Eventlistener for lagre knappen
      savePokemon(pokemonData);
    });
    deletePokemonBtn.addEventListener("click", () => {
      deletePokemon(pokemonData);
    });
    editPokemonBtn.addEventListener("click", () => {
      editPokemon(pokemonData);
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

function createOwnPokemon() {
  const newName = prompt("Enter the name for your Pokémon:");
  const primaryType = prompt("Enter the primary type for your Pokémon:");
  const secondaryType = prompt("Enter the secondary type for your Pokémon:");
  const imageUrl = prompt("Enter the URL for the Pokémon image:");

  if (!newName || !type || !imageUrl) {
    alert("Please enter a valid name, type, and image URL for your Pokémon.");
    return;
  }

  const pokemonContainer = document.getElementById("Pk-Container");

  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");
  pokemonCard.style.backgroundColor = getTypeColor(firstType);
  pokemonCard.dataset.name = newName;
  pokemonCard.style.textAlign = "center";

  const pokemonTypeElement = document.createElement("p");
  pokemonTypeElement.textContent = type;

  const pokemonNameElement = document.createElement("h3");
  pokemonNameElement.textContent = newName;

  const pokemonImageElement = document.createElement("img");
  pokemonImageElement.src = imageUrl;
  pokemonImageElement.style.width = "120px";
  pokemonImageElement.style.height = "80px";

  const editPokemonBtn = document.createElement("button");
  editPokemonBtn.textContent = "rediger";
  editPokemonBtn.addEventListener("click", () =>
    editPokemon({
      name: newName,
      types: [
        { type: { name: primaryType } },
        { type: { name: secondaryType } },
      ],
      imageUrl,
    })
  );

  const savePokemonBtn = document.createElement("button");
  savePokemonBtn.textContent = "Lagre";
  savePokemonBtn.addEventListener("click", () =>
    savePokemon({ name: newName, type, imageUrl })
  );

  const deletePokemonBtn = document.createElement("button");
  deletePokemonBtn.textContent = "slett";
  deletePokemonBtn.addEventListener("click", () =>
    deletePokemon({ name: newName, type, imageUrl })
  );

  savePokemonBtn.style.marginLeft = "5px";
  deletePokemonBtn.style.marginLeft = "5px";
  editPokemonBtn.style.marginLeft = "5px";
  pokemonCard.style.width = "180px";

  pokemonCard.appendChild(pokemonImageElement);
  pokemonCard.appendChild(pokemonNameElement);
  pokemonCard.appendChild(pokemonTypeElement);
  pokemonCard.appendChild(editPokemonBtn);
  pokemonCard.appendChild(savePokemonBtn);
  pokemonCard.appendChild(deletePokemonBtn);

  pokemonContainer.insertBefore(pokemonCard, pokemonContainer.firstChild); // Legger til nye pokemon i starten

  const newPokemon = {
    name: newName,
    types: [{ type: { name: primaryType } }, { type: { name: secondaryType } }],
    image: imageUrl,
  };

  pokemonList.unshift(newPokemon); // Legg til nye pokemondata i begynnelsen av listen
}
createNewPokemon.addEventListener("click", createOwnPokemon);

//pokemonData som parameter, variabel som inneholder info om Pokemon fra displayPokemon funksjonen
function savePokemon(pokemonData) {
  if (savedPokemons.length < 5) {
    const index = pokemonList.findIndex(
      (pokemon) => pokemon.name === pokemonData.name
    );
    pokemonList.splice(index, 1); //Finner indeks og fjerner 1 element

    const pokemonCard = document.querySelector(
      `[data-name="${pokemonData.name}"]`
    );
    if (pokemonCard) {
      pokemonCard.remove();
    }

    // Legger til pokemon i SavedPokemons array og localStorage
    savedPokemons.push(pokemonData);
    localStorage.setItem("savedPokemons", JSON.stringify(savedPokemons));

    displaySavedPokemons();
  } else {
    alert("Du kan kun lagre 5 pokemon.");
  }
}

function displaySavedPokemons() {
  const savedPokemonsContainer = document.getElementById("saved-pokemons");
  savedPokemonsContainer.innerHTML = "";

  savedPokemons.forEach((pokemonData) => {
    const savedPokemonCard = document.createElement("div");
    savedPokemonCard.style.textAlign = "center";
    savedPokemonCard.dataset.name = pokemonData.name;
    if (pokemonData.name && pokemonData.sprites) {
      const primaryType = pokemonData.types[0].type.name;
      savedPokemonCard.style.backgroundColor = getTypeColor(primaryType);
      savedPokemonCard.dataset.url = pokemonData.species.url;

      savedPokemonCard.innerHTML = `<img src=${
        pokemonData.sprites.front_default
      } />
                                     <h3>${pokemonData.name}</h3>
                                     <p>${pokemonData.types
                                       .map((type) => type.type.name)
                                       .join(", ")}</p>`;
    } else {
      savedPokemonCard.style.backgroundColor = getTypeColor(pokemonData.type); //egen lagd pokemon må handles annerledes, fordi type ikke må mappes
      savedPokemonCard.innerHTML = `<img src=${pokemonData.imageUrl} width="120px" height="80px"/>
                                    <h3>${pokemonData.name}</h3>
                                     <p>Type: ${pokemonData.type}</p>`;
    }

    const catchPokemonBtn = document.createElement("button");
    const deletePokemonBtn = document.createElement("button");
    const editPokemonBtn = document.createElement("button");

    catchPokemonBtn.textContent = "Lagre";
    deletePokemonBtn.textContent = "Fjern";
    editPokemonBtn.textContent = "Rediger";

    catchPokemonBtn.style.marginLeft = "5px";
    deletePokemonBtn.style.marginLeft = "5px";
    editPokemonBtn.style.marginLeft = "5px";

    savedPokemonsContainer.appendChild(savedPokemonCard);
    savedPokemonCard.append(catchPokemonBtn);
    savedPokemonCard.append(deletePokemonBtn);
    savedPokemonCard.append(editPokemonBtn);

    deletePokemonBtn.addEventListener("click", () => {
      deleteSavedPokemon(pokemonData);
    });
    editPokemonBtn.addEventListener("click", () => {
      editPokemon(pokemonData);
    });
  });
}

function deleteSavedPokemon(pokemonData) {
  const pokemonName = pokemonData.name;

  const savedIndex = savedPokemons.findIndex(
    (pokemon) => pokemon.name === pokemonName
  );

  savedPokemons.splice(savedIndex, 1);

  // Tydeligvis er det bedre å bruke setItem igjen, i stedet for removeItem, takk freeCodeCamp.
  localStorage.setItem("savedPokemons", JSON.stringify(savedPokemons));
  console.log(`Updated savedPokemons in localStorage.`);
  //trengte heller ikke url til pokemon, holdte med navn.
  const savedPokemonCard = document.querySelector(
    `[data-name="${pokemonName}"]`
  );
  savedPokemonCard.remove();
}

function deletePokemon(pokemonData) {
  const pokemonCard = document.querySelector(
    `div[data-name="${pokemonData.name}"]`
  );

  pokemonCard.remove();

  const index = pokemonList.findIndex(
    (pokemon) => pokemon.name === pokemonData.name
  );
  pokemonList.splice(index, 1);
}

function editPokemon(pokemonData) {
  const newName = prompt("Enter the new name for the Pokemon:");

  // Finn pokemonCard med riktig data-name
  const pokemonCard = document.querySelector(
    `div[data-name="${pokemonData.name}"]`
  );

  // Oppdater textContent og pokemonData med nytt navn fra prompt
  const pokemonNameElement = pokemonCard.querySelector("h3");
  pokemonNameElement.textContent = newName;
  pokemonData.name = newName;
  pokemonCard.dataset.name = newName;

  // Prompt for nye typer og sjekk hvor mange den har i forveien
  let newTypes;
  if (!pokemonData.types || pokemonData.types.length === 1) {
    //Må prompte også hvis det er en bruker lagd pokemon
    newTypes = [prompt("Enter the new type for the Pokemon:")];
  } else {
    newTypes = [
      prompt("Enter the new primary type for the Pokemon:"),
      prompt("Enter the new secondary type for the Pokemon:"),
    ];
  }

  // select p element og legg til typene med ,
  const pokemonTypeElement = pokemonCard.querySelector("p");

  const updatedTypes = newTypes.join(", ");
  pokemonTypeElement.textContent = updatedTypes;
  // oppdater også i pokemonData objektet
  pokemonData.types.forEach((type, index) => {
    type.type.name = newTypes[index];
  });

  const primaryType = pokemonData.types[0].type.name;
  pokemonCard.style.backgroundColor = getTypeColor(primaryType);
}

fetchPokemon();
displayTypes();
displaySavedPokemons();
