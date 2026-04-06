export const normalizePokemonInput = (value: string): string | number => {

    const asNumber = Number(value)

    // normalizing valids and integer numbers
    if (!Number.isNaN(asNumber) && Number.isInteger(asNumber)) return asNumber

    return value.toLowerCase()
}