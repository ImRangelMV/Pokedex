import {getFavorites} from "../features/favorites.js"
import {firstFavoriteButton, secondFavoriteButton, thirdFavoriteButton,
    pokemonNumber, pokemonName, pokemonImage, pokemonNameOrIdInput
} from "../dom/elements.js"
import {state} from "../state/state.js"
import {cachePokemon} from "../core/cache.js"

export const updateFavoriteUI = () => {

    const favorites = getFavorites()

    if (!firstFavoriteButton || !secondFavoriteButton || !thirdFavoriteButton || !favorites) return

    firstFavoriteButton.textContent = `${favorites[0]}`
    secondFavoriteButton.textContent = `${favorites[1]}`
    thirdFavoriteButton.textContent = `${favorites[2]}`

    if (favorites[0] === null) firstFavoriteButton.textContent = "I"
    if (favorites[1] === null) secondFavoriteButton.textContent = "II"
    if (favorites[2] === null) thirdFavoriteButton.textContent = "III"

}

export const renderPokemon = async (pokemonNameOrID: string | number) => {

    try {

        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput ||
            !firstFavoriteButton || !secondFavoriteButton || !thirdFavoriteButton) return

        // loading
        pokemonName.textContent = "Searching..."
        pokemonImage.style.display = "none"
        pokemonNumber.textContent = "#"

        firstFavoriteButton.textContent = "I"
        secondFavoriteButton.textContent = "II"
        thirdFavoriteButton.textContent = "III"

        const pokemon = await cachePokemon(pokemonNameOrID)

        // loaded
        pokemonNumber.textContent = String(pokemon.id)
        pokemonName.textContent = '- ' + pokemon.name

        const sprite = pokemon.sprites.versions["generation-v"]["black-white"]["animated"]["front_default"]

        if (!sprite) {
            pokemonImage.style.display = "none"
            return
        }

        pokemonImage.src = sprite
        pokemonImage.style.display = "block"

        updateFavoriteUI()

        //refresh ID and form after render
        state.currentID = pokemon.id
        pokemonNameOrIdInput.value = ""

    } catch {

        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput ||
            !firstFavoriteButton || !secondFavoriteButton || !thirdFavoriteButton) return

        pokemonNumber.textContent = "#"
        pokemonName.textContent = "Not encountered."
        pokemonImage.style.display = "none"
        pokemonNameOrIdInput.value = ""
        state.currentID = 0

        firstFavoriteButton.textContent = "1"
        secondFavoriteButton.textContent = "2"
        thirdFavoriteButton.textContent = "3"

    }
}