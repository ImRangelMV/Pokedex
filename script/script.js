const pokemonID = document.querySelector('.pokemon_id')
const pokemonName = document.querySelector('.pokemon_name')
const pokemonImage = document.querySelector('.pokemon_image')

const input = document.querySelector('.input_search')
const form = document.querySelector('.form')

const previousButton = document.querySelector('.previous_button')
const nextButton = document.querySelector('.next_button')

let searchPokemon = 158

const fetchPokemon = async (pokemon) => {

    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    if (APIResponse.status === 200) {
        return APIResponse.json()
    }
}

const renderPokemon = async (pokemon) => {

    pokemonName.textContent = 'Loading...'

    const data = await fetchPokemon(pokemon)

    if (!data) {
        pokemonID.textContent = '#'
        pokemonName.textContent = 'Not Found :c'
        pokemonImage.style.display = 'none'
        input.value = ''
    }


    if (data) {
        pokemonImage.style.display = 'block'
        pokemonID.textContent = data.id
        pokemonName.textContent = data.name
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
        searchPokemon = data.id
        input.value = ''
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault()

    renderPokemon(input.value)
})

previousButton.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon = searchPokemon - 1
        renderPokemon(searchPokemon)
    }
})

nextButton.addEventListener('click', () => {
    searchPokemon = searchPokemon + 1
    renderPokemon(searchPokemon)
})


renderPokemon(searchPokemon)