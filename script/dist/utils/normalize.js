export const normalizePokemonInput = (value) => {
    const asNumber = Number(value);
    // normalizing valids and integer numbers
    if (!Number.isNaN(asNumber) && Number.isInteger(asNumber))
        return asNumber;
    return value.toLowerCase();
};
