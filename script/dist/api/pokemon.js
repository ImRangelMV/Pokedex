import { state } from "../state/state.js";
export const searchPokemon = async (pokemonNameOrID, baseURL = state.baseURL) => {
    try {
        const pokemonResponseAPI = await fetch(`${baseURL}pokemon/${pokemonNameOrID}`);
        if (!pokemonResponseAPI.ok)
            throw new Error(`HTTP GET error from fetch status: ${pokemonResponseAPI.status}`);
        const pokemonData = await pokemonResponseAPI.json();
        return pokemonData;
    }
    catch (error) {
        console.error({
            where: "searchPokemon()",
            input: pokemonNameOrID,
            error
        });
        throw error;
    }
};
