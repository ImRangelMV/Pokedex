import { state } from "./state/state.js";
import { renderPokemon, updateFavoriteUI } from "./ui/render.js";
import { setupButtonsAndFormEvents } from "./events/handlers.js";
import { getFavorites } from "./features/favorites.js";
state.favorites = getFavorites();
renderPokemon(state.currentID);
updateFavoriteUI();
setupButtonsAndFormEvents();
