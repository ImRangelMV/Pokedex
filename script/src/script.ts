const searchPokemon = async (pokemonNameOrID: string | number) => {

    try {

        const pokemonResponseAPI = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrID}`
        )

        if (!pokemonResponseAPI.ok) throw new Error(`HTTP GET error from fetch status: ${pokemonResponseAPI.status}`)

        const pokemonData = await pokemonResponseAPI.json()
        return pokemonData

    } catch (error) {

        console.error({
            where: "searchPokemonh()",
            input: "pokemonNameOrID",
            error
        })
        throw error

    }
}

const pokemonNumber = document.querySelector<HTMLSpanElement>('.pokemonNumber')
const pokemonName = document.querySelector<HTMLParagraphElement>('.pokemonName')
const pokemonImage = document.querySelector<HTMLImageElement>('.pokemonImage')

let currentID = 1

const previousButtonPokedex = document.querySelector<HTMLButtonElement>('.previousButton')
const nextButtonPokedex = document.querySelector<HTMLButtonElement>('.nextButton')
const pokedexSearchForm = document.querySelector<HTMLFormElement>('.pokemonSearch')
const pokemonNameOrIdInput = document.querySelector<HTMLInputElement>('.inputSearch')

const renderPokemon = async (pokemonNameOrID: string | number) => {

    try {

        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput) return

        pokemonName.textContent = "Searching..."
        pokemonImage.style.display = "none"
        pokemonNumber.textContent = "#"

        const pokemon = await searchPokemon(pokemonNameOrID)

        pokemonNumber.textContent = String(pokemon.id)
        pokemonName.textContent = '- ' + pokemon.name

        const sprite = pokemon.sprites.versions["generation-v"]["black-white"]["animated"]["front_default"]
        pokemonImage.src = sprite
        pokemonImage.style.display = "block"

        //refresh ID and form after render
        currentID = pokemon.id
        pokemonNameOrIdInput.value = ""

    } catch {

        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput) return

        pokemonNumber.textContent = "#"
        pokemonName.textContent = "Not encontered."
        pokemonImage.style.display = "none"
        pokemonNameOrIdInput.value = ""

    }
}

const setupButtonsAndFormEvents = () => {

    if (!previousButtonPokedex || !nextButtonPokedex || !pokedexSearchForm || !pokemonNameOrIdInput) return

    previousButtonPokedex.addEventListener("click", () => {
        if (currentID > 1) currentID = currentID - 1
        renderPokemon(currentID)
    })

    nextButtonPokedex.addEventListener("click", () => {
        currentID = currentID + 1
        renderPokemon(currentID)
    })

    pokedexSearchForm.addEventListener("submit", (event) => {
        event.preventDefault()
        const value = pokemonNameOrIdInput.value.toLocaleLowerCase()

        if (!value) return
        renderPokemon(value)
    })
}

renderPokemon(currentID)
setupButtonsAndFormEvents()