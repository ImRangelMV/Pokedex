import { favoritesButtons, pokemonNumber, pokemonName, pokemonImage, pokemonNameOrIdInput } from "../dom/elements.js"
import { state } from "../state/state.js"
import { cachePokemon } from "../core/cache.js"

export const updateFavoriteUI = () => {

    favoritesButtons.forEach((button, index) => {

        const value = state.favorites[index] ?? state.labels[index]
        button.textContent = String(value)

    })
}

const setLoadingState = () => {

    pokemonName.textContent = "Searching..."
    pokemonImage.style.display = "none"
    pokemonNumber.textContent = "#"

}

const setErrorState = () => {

    pokemonNumber.textContent = "#"
    pokemonName.textContent = "Not encountered."
    pokemonImage.style.display = "none"
    pokemonNameOrIdInput.value = ""
    state.currentID = 0

}

export const renderPokemon = async (pokemonNameOrID: string | number) => {

    try {
        setLoadingState()

        const pokemon = await cachePokemon(pokemonNameOrID)

        pokemonNumber.textContent = String(pokemon.id)
        pokemonName.textContent = `- ${pokemon.name}`

        const sprite = pokemon.sprites.versions["generation-v"]["black-white"]["animated"]["front_default"]

        if (!sprite) {
            pokemonImage.style.display = "none"
            return
        }

        pokemonImage.src = sprite
        pokemonImage.style.display = "block"

        //refresh ID and form after render
        state.currentID = pokemon.id
        pokemonNameOrIdInput.value = ""

    } catch {

        setErrorState()

    }
}