import type { Favorites } from "../types/pokemon"
export type {Favorites} from "../types/pokemon.js"

export const state = {
    baseURL: `https://pokeapi.co/api/v2/`,
    currentID: 158,
    lastPokemonWithImage: 649,
    firstPokemonWithoutImage: 650,
    labels: ["I", "II", "III"] as const,
    favorites: [null, null, null] as Favorites,
    cacheMaxSize: 25,
    cacheTimeToLive: 60_000 //miliseconds
}