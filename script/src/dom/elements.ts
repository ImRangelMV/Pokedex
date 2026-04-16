function getElementDOM<T extends HTMLElement>(selector: string): T {

    const element = document.querySelector<T>(selector)
    if (!element) throw new Error(`Element not encountered: ${selector}`)

    return element

}

export const pokemonNumber = getElementDOM<HTMLSpanElement>(".pokemonNumber")
export const pokemonName = getElementDOM<HTMLParagraphElement>(".pokemonName")
export const pokemonImage = getElementDOM<HTMLImageElement>(".pokemonImage")
export const previousButtonNavigation = getElementDOM<HTMLButtonElement>('.previousButton')
export const nextButtonNavigation = getElementDOM<HTMLButtonElement>('.nextButton')
export const pokedexSearchForm = getElementDOM<HTMLFormElement>('.pokemonSearch')
export const pokemonNameOrIdInput = getElementDOM<HTMLInputElement>('.inputSearch')
export const favoriteStampButton = getElementDOM<HTMLButtonElement>('.favorite')
export const firstFavoriteButton = getElementDOM<HTMLButtonElement>('.one')
export const secondFavoriteButton = getElementDOM<HTMLButtonElement>('.two')
export const thirdFavoriteButton = getElementDOM<HTMLButtonElement>('.three')

export const favoritesButtons = [firstFavoriteButton, secondFavoriteButton, thirdFavoriteButton]