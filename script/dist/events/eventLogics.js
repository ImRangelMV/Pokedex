import { previousButtonNavigation, nextButtonNavigation, pokemonNameOrIdInput } from "../dom/elements.js";
import { state } from "../state/state.js";
import { renderPokemon } from "../ui/render.js";
import { normalizePokemonInput } from "../utils/normalize.js";
export const navigation = function () {
    if (this === previousButtonNavigation) {
        if (state.currentID >= 1)
            state.currentID = state.currentID - 1;
        if (state.currentID < 1)
            state.currentID = state.firstPokemonWithoutImage - 1;
    }
    if (this === nextButtonNavigation) {
        if (state.currentID >= state.lastPokemonWithImage)
            state.currentID = 0;
        state.currentID = state.currentID + 1;
    }
    renderPokemon(state.currentID);
};
export const input = () => {
    if (pokemonNameOrIdInput !== null) {
        const rawValue = pokemonNameOrIdInput.value;
        const normalizedValue = normalizePokemonInput(rawValue);
        renderPokemon(normalizedValue);
    }
};
