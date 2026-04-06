const getFavorites = () => {
    let fav = localStorage.getItem("IDs");
    if (!fav)
        return [null, null, null];
    // parse returns a array copy
    let favRecupered = JSON.parse(fav);
    return favRecupered;
};
const setFavorites = (favArray) => {
    let arrayToString = JSON.stringify(favArray);
    localStorage.setItem("IDs", arrayToString);
};
export { getFavorites, setFavorites };
