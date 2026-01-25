const searchPokemon = async (pokemonNameOrID) => {
    try {
        const pokemonResponseAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrID}`);
        if (!pokemonResponseAPI.ok)
            throw new Error(`HTTP GET error from fetch status: ${pokemonResponseAPI.status}`);
        const pokemonData = await pokemonResponseAPI.json();
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
const cacheName = new Map();
const cacheID = new Map();
const cacheTimeToLive = 1_000; // miliseconds
const cachePokemon = async (pokemonNameOrID) => {
    //Lazy TimeToLive to refresh data...
    if (typeof (pokemonNameOrID) === "string" && cacheName.has(pokemonNameOrID)) {
        const nameCached = cacheName.get(pokemonNameOrID);
        const nameAge = Date.now() - nameCached.timestamp;
        if (nameAge <= cacheTimeToLive)
            return nameCached.data;
        cacheName.delete(pokemonNameOrID);
        console.log(`${pokemonNameOrID} Deleted`);
    }
    if (typeof (pokemonNameOrID) === "number" && cacheID.has(pokemonNameOrID)) {
        const IDcached = cacheID.get(pokemonNameOrID);
        const IDAge = Date.now() - IDcached.timestamp;
        if (IDAge <= cacheTimeToLive)
            return IDcached.data;
        cacheID.delete(pokemonNameOrID);
        console.log(`${pokemonNameOrID} Deleted`);
    }
    //Least Recently Used...
    const pokemonData = await searchPokemon(pokemonNameOrID);
    //feeding cache
    cacheName.set(pokemonData.name, { data: pokemonData, timestamp: Date.now() });
    cacheID.set(pokemonData.id, { data: pokemonData, timestamp: Date.now() });
    console.log(`${pokemonNameOrID} Cached`);
    return pokemonData;
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
        const pokemon = await cachePokemon(pokemonNameOrID);
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
const normalizePokemonInput = (value) => {
    const asNumber = Number(value);
    // isNaN(Number) say if this Number is valid or not. So, !isNaN say if he is valid.
    if (!Number.isNaN(asNumber) && Number.isInteger(asNumber))
        return asNumber;
    return value.toLowerCase();
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
        const rawValue = pokemonNameOrIdInput.value.toLocaleLowerCase();
        if (!rawValue)
            return;
        const normalizedValue = normalizePokemonInput(rawValue);
        console.log(typeof (normalizedValue));
        renderPokemon(normalizedValue);
    });
};
renderPokemon(currentID);
setupButtonsAndFormEvents();
export {};
