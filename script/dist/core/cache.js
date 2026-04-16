import { searchPokemon } from "../api/pokemon.js";
import { state } from "../state/state.js";
const cache = new Map();
const nameToID = new Map();
export const cachePokemon = async (pokemonNameOrID) => {
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
        if (pokemonAge <= state.cacheTimeToLive) {
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
    if (cache.size > state.cacheMaxSize) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey !== undefined)
            cache.delete(oldestKey);
    }
    return pokemonData;
};
