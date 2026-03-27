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
            where: "searchPokemon()",
            input: "pokemonNameOrID",
            error
        });
        throw error;
    }
};
const cache = new Map();
const nameToID = new Map();
const cacheTimeToLive = 60_000; // miliseconds
const cacheMaxSize = 25;
const cachePokemon = async (pokemonNameOrID) => {
    // normalizing
    let resolvedID = null;
    if (typeof (pokemonNameOrID) === "number")
        resolvedID = pokemonNameOrID;
    if (typeof (pokemonNameOrID) === "string" && nameToID.has(pokemonNameOrID))
        resolvedID = nameToID.get(pokemonNameOrID);
    // Lazy TimeToLive to refresh data...
    if (resolvedID !== null && cache.has(resolvedID)) {
        const entry = cache.get(resolvedID);
        const pokemon = entry.data;
        const pokemonBirth = entry.timestamp;
        const pokemonAge = Date.now() - pokemonBirth;
        // valid TTL → LRU moves to end
        if (pokemonAge <= cacheTimeToLive) {
            cache.delete(resolvedID);
            cache.set(resolvedID, {
                data: pokemon,
                timestamp: Date.now()
            });
            return pokemon;
        }
        // expired TTL → remove
        cache.delete(resolvedID);
    }
    const pokemonData = await searchPokemon(pokemonNameOrID);
    // feeding cache
    cache.set(pokemonData.id, { data: pokemonData, timestamp: Date.now() });
    nameToID.set(pokemonData.name, pokemonData.id);
    // eviction (LRU)
    if (cache.size > cacheMaxSize) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey !== undefined)
            cache.delete(oldestKey);
    }
    return pokemonData;
};
const pokemonNumber = document.querySelector('.pokemonNumber');
const pokemonName = document.querySelector('.pokemonName');
const pokemonImage = document.querySelector('.pokemonImage');
let currentID = 158;
const previousButtonNavigation = document.querySelector('.previousButton');
const nextButtonNavigation = document.querySelector('.nextButton');
const pokedexSearchForm = document.querySelector('.pokemonSearch');
const pokemonNameOrIdInput = document.querySelector('.inputSearch');
const favoriteStampButton = document.querySelector('.favorite');
const firstFavoriteButton = document.querySelector('.one');
const secondFavoriteButton = document.querySelector('.two');
const thirdFavoriteButton = document.querySelector('.three');
const updateFavoriteUI = () => {
    const favorites = getFavorites();
    if (!firstFavoriteButton || !secondFavoriteButton || !thirdFavoriteButton || !favorites)
        return;
    firstFavoriteButton.textContent = `${favorites[0]}`;
    secondFavoriteButton.textContent = `${favorites[1]}`;
    thirdFavoriteButton.textContent = `${favorites[2]}`;
    if (favorites[0] === null)
        firstFavoriteButton.textContent = "I";
    if (favorites[1] === null)
        secondFavoriteButton.textContent = "II";
    if (favorites[2] === null)
        thirdFavoriteButton.textContent = "III";
};
const renderPokemon = async (pokemonNameOrID) => {
    try {
        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput ||
            !firstFavoriteButton || !secondFavoriteButton || !thirdFavoriteButton)
            return;
        // loading
        pokemonName.textContent = "Searching...";
        pokemonImage.style.display = "none";
        pokemonNumber.textContent = "#";
        firstFavoriteButton.textContent = "1";
        secondFavoriteButton.textContent = "2";
        thirdFavoriteButton.textContent = "3";
        const pokemon = await cachePokemon(pokemonNameOrID);
        // loaded
        pokemonNumber.textContent = String(pokemon.id);
        pokemonName.textContent = '- ' + pokemon.name;
        const sprite = pokemon.sprites.versions["generation-v"]["black-white"]["animated"]["front_default"];
        if (!sprite) {
            pokemonImage.style.display = "none";
            return;
        }
        pokemonImage.src = sprite;
        pokemonImage.style.display = "block";
        updateFavoriteUI();
        //refresh ID and form after render
        currentID = pokemon.id;
        pokemonNameOrIdInput.value = "";
    }
    catch {
        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput ||
            !firstFavoriteButton || !secondFavoriteButton || !thirdFavoriteButton)
            return;
        pokemonNumber.textContent = "#";
        pokemonName.textContent = "Not encountered.";
        pokemonImage.style.display = "none";
        pokemonNameOrIdInput.value = "";
        currentID = 0;
        firstFavoriteButton.textContent = "1";
        secondFavoriteButton.textContent = "2";
        thirdFavoriteButton.textContent = "3";
    }
};
const normalizePokemonInput = (value) => {
    const asNumber = Number(value);
    // normalizing valids and integer numbers
    if (!Number.isNaN(asNumber) && Number.isInteger(asNumber))
        return asNumber;
    return value.toLowerCase();
};
const lastPokemonWithImage = 649;
const firstPokemonWithoutImage = 650;
const getFavorites = () => {
    let fav = localStorage.getItem("IDs");
    if (!fav)
        return [null, null, null];
    // parse returns a array copy
    let favRecupered = JSON.parse(fav);
    return favRecupered;
};
const setFavorites = (favArray) => {
    let arrayToString = JSON.stringify(favArray);
    localStorage.setItem("IDs", arrayToString);
};
// const favorites = getFavorites()
const setupButtonsAndFormEvents = () => {
    if (!previousButtonNavigation || !nextButtonNavigation || !pokedexSearchForm || !pokemonNameOrIdInput
        || !favoriteStampButton || !firstFavoriteButton || !secondFavoriteButton || !thirdFavoriteButton)
        return;
    previousButtonNavigation.addEventListener("click", () => {
        if (currentID >= 1)
            currentID = currentID - 1;
        if (currentID < 1)
            currentID = firstPokemonWithoutImage - 1;
        renderPokemon(currentID);
    });
    nextButtonNavigation.addEventListener("click", () => {
        if (currentID >= lastPokemonWithImage)
            currentID = 0;
        currentID = currentID + 1;
        renderPokemon(currentID);
    });
    favoriteStampButton.addEventListener("click", () => {
        const favorites = getFavorites();
        let index = -1;
        for (let i = 0; i < favorites.length; i = i + 1) {
            //avoid duplicates
            if (favorites[i] === currentID)
                return;
            //replace the first null
            if (favorites[i] === null) {
                index = i;
                break;
            }
        }
        if (index !== -1)
            favorites[index] = currentID;
        if (index === -1) {
            favorites.shift();
            favorites.push(currentID);
        }
        setFavorites(favorites);
        updateFavoriteUI();
    });
    firstFavoriteButton.addEventListener("click", () => {
        const favorites = getFavorites();
        if (typeof (favorites[0]) === "number")
            currentID = favorites[0];
        renderPokemon(currentID);
    });
    secondFavoriteButton.addEventListener("click", () => {
        const favorites = getFavorites();
        if (typeof (favorites[1]) === "number")
            currentID = favorites[1];
        renderPokemon(currentID);
    });
    thirdFavoriteButton.addEventListener("click", (event) => {
        const favorites = getFavorites();
        if (typeof (favorites[2]) === "number")
            currentID = favorites[2];
        renderPokemon(currentID);
    });
    pokedexSearchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const rawValue = pokemonNameOrIdInput.value;
        const normalizedValue = normalizePokemonInput(rawValue);
        renderPokemon(normalizedValue);
    });
};
renderPokemon(currentID);
setupButtonsAndFormEvents();
export {};
