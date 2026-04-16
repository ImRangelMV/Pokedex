function getElementDOM(selector) {
    const element = document.querySelector(selector);
    if (!element)
        throw new Error(`Element not encountered: ${selector}`);
    return element;
}
export const pokemonNumber = getElementDOM(".pokemonNumber");
export const pokemonName = getElementDOM(".pokemonName");
export const pokemonImage = getElementDOM(".pokemonImage");
export const previousButtonNavigation = getElementDOM('.previousButton');
export const nextButtonNavigation = getElementDOM('.nextButton');
export const pokedexSearchForm = getElementDOM('.pokemonSearch');
export const pokemonNameOrIdInput = getElementDOM('.inputSearch');
export const favoriteStampButton = getElementDOM('.favorite');
export const firstFavoriteButton = getElementDOM('.one');
export const secondFavoriteButton = getElementDOM('.two');
export const thirdFavoriteButton = getElementDOM('.three');
export const favoritesButtons = [firstFavoriteButton, secondFavoriteButton, thirdFavoriteButton];
