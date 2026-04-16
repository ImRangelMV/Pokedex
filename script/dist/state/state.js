export const state = {
    baseURL: `https://pokeapi.co/api/v2/`,
    currentID: 158,
    lastPokemonWithImage: 649,
    firstPokemonWithoutImage: 650,
    labels: ["I", "II", "III"],
    favorites: [null, null, null],
    cacheMaxSize: 25,
    cacheTimeToLive: 60_000 //miliseconds
};
