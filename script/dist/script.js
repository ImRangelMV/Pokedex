import { state } from "./state/state.js";
import { renderPokemon } from "./ui/render.js";
import { setupButtonsAndFormEvents } from "./events/handlers.js";
renderPokemon(state.currentID);
setupButtonsAndFormEvents();
