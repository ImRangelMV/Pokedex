import type { PokemonAPI } from "../types/pokemon"

export const searchPokemon = async (pokemonNameOrID: string | number): Promise<PokemonAPI> => {

    try {

        const pokemonResponseAPI = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrID}`
        )

        if (!pokemonResponseAPI.ok) throw new Error(`HTTP GET error from fetch status: ${pokemonResponseAPI.status}`)

        const pokemonData: PokemonAPI = await pokemonResponseAPI.json()

        return pokemonData

    } catch (error) {

        console.error({
            where: "searchPokemon()",
            input: "pokemonNameOrID",
            error
        })

        throw error
    }
}