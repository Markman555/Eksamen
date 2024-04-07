/* Oppgave 2: Dynamisk Oppdatering av Innhold (Pokemon) – 
Lag en nettside med en knapp. Når brukeren klikker på knappen, 
skal du bruke Fetch API til å hente en tilfeldig Pokemon fra et Pokemon-API 
(f.eks.: https://pokeapi.co/api/v2/). Vis Pokemon på nettsiden.
 */

const baseUrl = "https://pokeapi.co/api/v2/";
const endPoint = "pokemon";
const url = `${baseUrl}${endPoint}`;
const btn = document.getElementById("pokemon");
const showPokemons = document.getElementById("pokemon_container");

const pokemonApi = async () => {
    return fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("NOE GIKK GALT!!!");
            return res.json();
        })
        .then(res => {
            return res;
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
};

const displayPokemons = async () => {
    const pokemons = await pokemonApi();
    if (!pokemons) return;
    console.log(pokemons); 
    // Velger en tilfeldig Pokémon fra listen
    const randomIndex = Math.floor(Math.random() * pokemons.results.length);
    const randomPokemon = pokemons.results[randomIndex].url;

    // Henter data for den tilfeldige Pokémonen
    const pokemonResponse = await fetch(randomPokemon);
    if (!pokemonResponse.ok) {
        console.error("Kunne ikke hente pokemonen!!!");
        return;
    }
    const pokemon = await pokemonResponse.json();

    // Oppretter et bildeelement for den tilfeldige Pokémonen
    const pokemonImage = document.createElement("img");
    pokemonImage.src = pokemon.sprites.front_default;

    // Oppretter et element for navnet på Pokémonen
    const pokemonName = document.createElement("p");
    pokemonName.textContent = pokemon.name;


    // Fjerner tidligere Pokémoner fra beholderen og legg til den nye
    showPokemons.innerHTML = '';
    showPokemons.appendChild(pokemonName);
    showPokemons.appendChild(pokemonImage);
};
btn.addEventListener("click", displayPokemons);
