export const getFavorites = (): [number | null, number | null, number | null] => {

    let fav = localStorage.getItem("IDs")
    if (!fav) return [null, null, null]

    // parse returns a array copy
    let favRecupered: [number | null, number | null, number | null] = JSON.parse(fav)

    return favRecupered
}

export const setFavorites = (favArray: [number | null, number | null, number | null]) => {

    let arrayToString = JSON.stringify(favArray)

    localStorage.setItem("IDs", arrayToString)

}