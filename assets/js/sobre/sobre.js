function getPokemon (pokeNumber) {
    const pokemon = {}
    pokemon.url = `https://pokeapi.co/api/v2/pokemon/${pokeNumber}/`
    pokeApiAbout.getPokemonDetail(pokemon)
        .then((pokeDetail) => {
            sessionStorage.setItem('pokemon', JSON.stringify(pokeDetail));
            window.location.href = "sobre.html"
        })
}