const cacheName = new Map();
const cacheID = new Map();
const searchPokemon = async (pokemonNameOrID) => {
    try {
        // I used non‑null assertion operator (!) because its garantee the existence of cache with if cache.has()
        if (typeof (pokemonNameOrID) === "string" && cacheName.has(pokemonNameOrID))
            return cacheName.get(pokemonNameOrID);
        if (typeof (pokemonNameOrID) === "number" && cacheID.has(pokemonNameOrID))
            return cacheID.get(pokemonNameOrID);
        const pokemonResponseAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrID}`);
        if (!pokemonResponseAPI.ok)
            throw new Error(`HTTP GET error from fetch status: ${pokemonResponseAPI.status}`);
        const pokemonData = await pokemonResponseAPI.json();
        cacheName.set(pokemonData.name, pokemonData);
        cacheID.set(pokemonData.id, pokemonData);
        return pokemonData;
    }
    catch (error) {
        console.error({
            where: "searchPokemonh()",
            input: "pokemonNameOrID",
            error
        });
        throw error;
    }
};
const pokemonNumber = document.querySelector('.pokemonNumber');
const pokemonName = document.querySelector('.pokemonName');
const pokemonImage = document.querySelector('.pokemonImage');
let currentID = 1;
const previousButtonPokedex = document.querySelector('.previousButton');
const nextButtonPokedex = document.querySelector('.nextButton');
const pokedexSearchForm = document.querySelector('.pokemonSearch');
const pokemonNameOrIdInput = document.querySelector('.inputSearch');
const renderPokemon = async (pokemonNameOrID) => {
    try {
        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput)
            return;
        pokemonName.textContent = "Searching...";
        pokemonImage.style.display = "none";
        pokemonNumber.textContent = "#";
        const pokemon = await searchPokemon(pokemonNameOrID);
        pokemonNumber.textContent = String(pokemon.id);
        pokemonName.textContent = '- ' + pokemon.name;
        const sprite = pokemon.sprites.versions["generation-v"]["black-white"]["animated"]["front_default"];
        if (!sprite) {
            pokemonImage.style.display = "none";
            return;
        }
        pokemonImage.src = sprite;
        pokemonImage.style.display = "block";
        //refresh ID and form after render
        currentID = pokemon.id;
        pokemonNameOrIdInput.value = "";
    }
    catch {
        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput)
            return;
        pokemonNumber.textContent = "#";
        pokemonName.textContent = "Not encontered.";
        pokemonImage.style.display = "none";
        pokemonNameOrIdInput.value = "";
    }
};
const setupButtonsAndFormEvents = () => {
    if (!previousButtonPokedex || !nextButtonPokedex || !pokedexSearchForm || !pokemonNameOrIdInput)
        return;
    previousButtonPokedex.addEventListener("click", () => {
        if (currentID > 1)
            currentID = currentID - 1;
        renderPokemon(currentID);
    });
    nextButtonPokedex.addEventListener("click", () => {
        currentID = currentID + 1;
        renderPokemon(currentID);
    });
    pokedexSearchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = pokemonNameOrIdInput.value.toLocaleLowerCase();
        if (!value)
            return;
        renderPokemon(value);
    });
};
renderPokemon(currentID);
setupButtonsAndFormEvents();
export {};
