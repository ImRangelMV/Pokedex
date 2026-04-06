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

export type { PokemonSprite, PokemonAPI, CacheEntry}