const pokeApiAbout = {}

function convertpokeApiAboutDetailToPokemon(pokeDetail) {
    
    const pokemon = new PokemonAbout()
    pokemon.number = String(pokeDetail.id).padStart(3, '0')
    pokemon.name = pokeDetail.name    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    // Sobre
    pokemon.species = pokeDetail.species
    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight
    pokemon.abilities = pokeDetail.abilities.map((ability) => ability.ability.name).join(', ')

    // Estatisticas
    pokemon.stats = pokeDetail.stats

    // Movimentos
    pokemon.moves = pokeDetail.moves

    return pokemon
}
