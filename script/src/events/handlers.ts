import {
    previousButtonNavigation, nextButtonNavigation, pokedexSearchForm, pokemonNameOrIdInput,
    favoriteStampButton, firstFavoriteButton, secondFavoriteButton, thirdFavoriteButton
} from "../dom/elements.js"

import { state } from "../state/state.js"

import { renderPokemon } from "../ui/render.js"

import { getFavorites, setFavorites } from "../features/favorites.js"

import { updateFavoriteUI } from "../ui/render.js"

import { normalizePokemonInput } from "../utils/normalize.js"

export const setupButtonsAndFormEvents = () => {

    if (!previousButtonNavigation || !nextButtonNavigation || !pokedexSearchForm || !pokemonNameOrIdInput
        || !favoriteStampButton || !firstFavoriteButton || !secondFavoriteButton || !thirdFavoriteButton) return

    previousButtonNavigation.addEventListener("click", () => {
        if (state.currentID >= 1) state.currentID = state.currentID - 1
        if (state.currentID < 1) state.currentID = state.firstPokemonWithoutImage - 1
        renderPokemon(state.currentID)
    })

    nextButtonNavigation.addEventListener("click", () => {
        if (state.currentID >= state.lastPokemonWithImage) state.currentID = 0
        state.currentID = state.currentID + 1
        renderPokemon(state.currentID)
    })

    favoriteStampButton.addEventListener("click", () => {

        const favorites = getFavorites()
        let index = -1

        for (let i = 0; i < favorites.length; i = i + 1) {

            //avoid duplicates
            if (favorites[i] === state.currentID) return

            //replace the first null
            if (favorites[i] === null) {
                index = i
                break
            }
        }

        if (index !== -1) favorites[index] = state.currentID

        if (index === -1) {

            favorites.shift()
            favorites.push(state.currentID)

        }

        setFavorites(favorites)
        updateFavoriteUI()

    })

    firstFavoriteButton.addEventListener("click", () => {
        const favorites = getFavorites()
        if (typeof (favorites[0]) === "number") state.currentID = favorites[0]
        renderPokemon(state.currentID)
    })

    secondFavoriteButton.addEventListener("click", () => {
        const favorites = getFavorites()
        if (typeof (favorites[1]) === "number") state.currentID = favorites[1]
        renderPokemon(state.currentID)
    })

    thirdFavoriteButton.addEventListener("click", (event) => {
        const favorites = getFavorites()
        if (typeof (favorites[2]) === "number") state.currentID = favorites[2]
        renderPokemon(state.currentID)
    })

    pokedexSearchForm.addEventListener("submit", (event) => {
        event.preventDefault()

        if (pokemonNameOrIdInput !== null) {

            const rawValue = pokemonNameOrIdInput.value
            const normalizedValue = normalizePokemonInput(rawValue)

            renderPokemon(normalizedValue)
        }
    })
}