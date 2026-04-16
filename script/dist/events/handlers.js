import { previousButtonNavigation, nextButtonNavigation, pokedexSearchForm, favoriteStampButton, favoritesButtons } from "../dom/elements.js";
import { addFavorite, renderFavoriteChoosed } from "../features/favorites.js";
import { navigation, input } from "./eventLogics.js";
export const setupButtonsAndFormEvents = () => {
    //buttons
    previousButtonNavigation.addEventListener("click", navigation);
    nextButtonNavigation.addEventListener("click", navigation);
    favoriteStampButton.addEventListener("click", addFavorite);
    favoritesButtons.forEach((button, index) => {
        button.addEventListener("click", () => { renderFavoriteChoosed(index); });
    });
    //form
    pokedexSearchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        input();
    });
};
