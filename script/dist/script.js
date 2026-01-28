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
const cache = new Map();
const nameToID = new Map();
const cacheTimeToLive = 10_000; // miliseconds
const cachePokemon = async (pokemonNameOrID) => {
    let resolvedID = null;
    if (typeof (pokemonNameOrID) === "number")
        resolvedID = pokemonNameOrID;
    if (typeof (pokemonNameOrID) === "string" && nameToID.has(pokemonNameOrID))
        resolvedID = nameToID.get(pokemonNameOrID);
    //Lazy TimeToLive to refresh data...
    if (resolvedID !== null && cache.has(resolvedID)) {
        const entry = cache.get(resolvedID);
        const pokemon = entry.data;
        const pokemonBirth = entry.timestamp;
        const pokemonAge = Date.now() - pokemonBirth;
        if (pokemonAge <= cacheTimeToLive)
            return pokemon;
        cache.delete(resolvedID);
        console.log(`${resolvedID} Deleted`);
    }
    const pokemonData = await searchPokemon(pokemonNameOrID);
    //feeding cache
    cache.set(pokemonData.id, { data: pokemonData, timestamp: Date.now() });
    nameToID.set(pokemonData.name, pokemonData.id);
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
        const rawValue = pokemonNameOrIdInput.value.toLowerCase();
        const normalizedValue = normalizePokemonInput(rawValue);
        renderPokemon(normalizedValue);
    });
};
renderPokemon(currentID);
setupButtonsAndFormEvents();
export {};
