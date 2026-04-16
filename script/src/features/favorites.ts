import { state } from "../state/state.js"
import { updateFavoriteUI, renderPokemon } from "../ui/render.js"
import type { Favorites } from "../types/pokemon.js"

export const getFavorites = (): Favorites => {

    let fav = localStorage.getItem("IDs")
    if (!fav) return [null, null, null]

    // parse returns a array copy
    let favRecupered: Favorites = JSON.parse(fav)

    return favRecupered
}

export const setFavorites = (favRecupered: Favorites) => {

    let arrayToString = JSON.stringify(favRecupered)

    localStorage.setItem("IDs", arrayToString)

}

export const addFavorite = () => {

    let index = -1

    for (let i = 0; i < state.favorites.length; i = i + 1) {

        //avoid duplicates
        if (state.favorites[i] === state.currentID) return

        //replace the first null
        if (state.favorites[i] === null) {
            index = i
            break
        }
    }

    if (index !== -1) state.favorites[index] = state.currentID

    if (index === -1) {

        state.favorites.shift()
        state.favorites.push(state.currentID)

    }

    setFavorites(state.favorites)
    updateFavoriteUI()
}

export const renderFavoriteChoosed = (buttonNumber: number) => {

    if (typeof (state.favorites[buttonNumber]) === "number") state.currentID = state.favorites[buttonNumber]

    renderPokemon(state.currentID)

}