import type { PokemonAPI } from "../types/pokemon.js"
import { state } from "../state/state.js"

export const searchPokemon = async (pokemonNameOrID: string | number, baseURL: string = state.baseURL): Promise<PokemonAPI> => {

    try {

        const pokemonResponseAPI = await fetch(
            `${baseURL}pokemon/${pokemonNameOrID}`
        )

        if (!pokemonResponseAPI.ok) throw new Error(`HTTP GET error from fetch status: ${pokemonResponseAPI.status}`)

        const pokemonData: PokemonAPI = await pokemonResponseAPI.json()

        return pokemonData

    } catch (error) {

        console.error({
            where: "searchPokemon()",
            input: pokemonNameOrID,
            error
        })

        throw error
    }
}