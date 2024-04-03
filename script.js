const pokemonContainer = document.getElementById("Pk-Container");
const select = document.getElementById("type-selection");
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
        const response = await fetch(`https://pokeapi.co/api/v2/type`)
        const typesData = await response.json();
        const types = typesData.results.map((type) => type.name) //I JSON formatet kan arrayet med objekter mappes for å hente type navn
        return types
    
} catch (error) {
    console.error("Error:", error);
  }
}

async function displayPokemons() {
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


