interface PokemonSprite {
    versions: {
        "generation-v": {
            "black-white": {
                "animated": {
                    "front_default": string | null
                }
            }
        }
    }
}

interface PokemonAPI {
    id: number
    name: string
    sprites: PokemonSprite
}

interface CacheEntry {
    data: PokemonAPI
    timestamp: number
}

const searchPokemon = async (pokemonNameOrID: string | number): Promise<PokemonAPI> => {

    try {

        const pokemonResponseAPI = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrID}`
        )

        if (!pokemonResponseAPI.ok) throw new Error(`HTTP GET error from fetch status: ${pokemonResponseAPI.status}`)

        const pokemonData: PokemonAPI = await pokemonResponseAPI.json()

        return pokemonData

    } catch (error) {

        console.error({
            where: "searchPokemon()",
            input: "pokemonNameOrID",
            error
        })

        throw error
    }
}

const cache = new Map<number, CacheEntry>()
const nameToID = new Map<string, number>()
const cacheTimeToLive = 60_000 // miliseconds
const cacheMaxSize = 25

const cachePokemon = async (pokemonNameOrID: string | number): Promise<PokemonAPI> => {

    // normalizing
    let resolvedID: number | null = null

    if (typeof (pokemonNameOrID) === "number") resolvedID = pokemonNameOrID

    if (typeof (pokemonNameOrID) === "string" && nameToID.has(pokemonNameOrID)) resolvedID = nameToID.get(pokemonNameOrID)!

    // Lazy TimeToLive to refresh data...
    if (resolvedID !== null && cache.has(resolvedID)) {
        
        const entry = cache.get(resolvedID)!

        const pokemon = entry.data
        const pokemonBirth = entry.timestamp
        const pokemonAge = Date.now() - pokemonBirth

        // valid TTL → LRU moves to end
        if (pokemonAge <= cacheTimeToLive) {

            cache.delete(resolvedID)
            cache.set(resolvedID, {
                data: pokemon, 
                timestamp: Date.now()
            })

            return pokemon
        } 
        
        // expired TTL → remove
        cache.delete(resolvedID)
    }

    const pokemonData = await searchPokemon(pokemonNameOrID)

    // feeding cache
    cache.set(pokemonData.id, { data: pokemonData, timestamp: Date.now() })
    nameToID.set(pokemonData.name, pokemonData.id)

    // eviction (LRU)
    if (cache.size > cacheMaxSize) {

        const oldestKey = cache.keys().next().value
        if(oldestKey !== undefined) cache.delete(oldestKey)

    }

    return pokemonData
}

const pokemonNumber = document.querySelector<HTMLSpanElement>('.pokemonNumber')
const pokemonName = document.querySelector<HTMLParagraphElement>('.pokemonName')
const pokemonImage = document.querySelector<HTMLImageElement>('.pokemonImage')

let currentID = 158

const previousButtonPokedex = document.querySelector<HTMLButtonElement>('.previousButton')
const nextButtonPokedex = document.querySelector<HTMLButtonElement>('.nextButton')
const pokedexSearchForm = document.querySelector<HTMLFormElement>('.pokemonSearch')
const pokemonNameOrIdInput = document.querySelector<HTMLInputElement>('.inputSearch')

const renderPokemon = async (pokemonNameOrID: string | number) => {

    try {

        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput) return

        // loading
        pokemonName.textContent = "Searching..."
        pokemonImage.style.display = "none"
        pokemonNumber.textContent = "#"

        const pokemon = await cachePokemon(pokemonNameOrID)

        // loaded
        pokemonNumber.textContent = String(pokemon.id)
        pokemonName.textContent = '- ' + pokemon.name

        const sprite = pokemon.sprites.versions["generation-v"]["black-white"]["animated"]["front_default"]

        if (!sprite) {
            pokemonImage.style.display = "none"
            return
        }

        pokemonImage.src = sprite
        pokemonImage.style.display = "block"

        //refresh ID and form after render
        currentID = pokemon.id
        pokemonNameOrIdInput.value = ""

    } catch {

        if (!pokemonNumber || !pokemonName || !pokemonImage || !pokemonNameOrIdInput) return

        pokemonNumber.textContent = "#"
        pokemonName.textContent = "Not encountered."
        pokemonImage.style.display = "none"
        pokemonNameOrIdInput.value = ""
        currentID = 0

    }
}

const normalizePokemonInput = (value: string): string | number => {

    const asNumber = Number(value)

    // normalizing valids and integer numbers
    if (!Number.isNaN(asNumber) && Number.isInteger(asNumber)) return asNumber

    return value.toLowerCase()
}

const lastPokemonWithImage = 649
const firstPokemonWithoutImage = 650

const setupButtonsAndFormEvents = () => {

    if (!previousButtonPokedex || !nextButtonPokedex || !pokedexSearchForm || !pokemonNameOrIdInput) return

    previousButtonPokedex.addEventListener("click", () => {
        if (currentID > 1) currentID = currentID - 1
        if (currentID <= 1) currentID = firstPokemonWithoutImage - 1
        renderPokemon(currentID)
    })

    nextButtonPokedex.addEventListener("click", () => {
        if (currentID >= lastPokemonWithImage) currentID = 0
        currentID = currentID + 1
        renderPokemon(currentID)
    })

    pokedexSearchForm.addEventListener("submit", (event) => {
        event.preventDefault()

        const rawValue = pokemonNameOrIdInput.value
        const normalizedValue = normalizePokemonInput(rawValue) 

        renderPokemon(normalizedValue)
    })
}

renderPokemon(currentID)
setupButtonsAndFormEvents()