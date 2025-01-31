const aboutHeaderValues = document.getElementById('about-values')
const aboutDetailsData = document.getElementById('poke-data-details')


document.addEventListener('DOMContentLoaded', () => {
    var pokemonDetail = JSON.parse(sessionStorage.getItem('pokemon'))
    if (pokemonDetail){
        fillValues(pokemonDetail)
        document.body.classList.add(pokemonDetail.type)
    }
});


function fillValuesAboutHeaderPokemon(pokemonValues){
    return `
        <div id="title" class="title-values">
        <h1 style="font-size: 2.4em;"> ${pokemonValues.name} </h1>
        <h3 style="letter-spacing: 1.5px"> #${pokemonValues.number} </h3>
        </div>
        <div>
        ${pokemonValues.types.map((type) => `<span class="type ${type}">${type}</span>`).join('')}
        </div>
        <div class="poke-img-container">
        <img alt="imagem do pokemon" src="${pokemonValues.photo}">
        </div>
    `
}

function fillValuesAboutDetailsPokemon(pokemonValues){
    let tot_stat = 0;
    return `
        <table>
            <thead>
                <tr class="poke-about-headline">
                    <th class="active-header about" data-section="about">About</th>
                    <th class="base-stats" data-section="base-stats">Base Stats</th>
                    <th class="moves" data-section="moves">Moves</th>
                </tr>
            </thead>
            <tbody>
                <!-- About section -->
                <tr class="about show">
                    <td>Species</td>
                    <td colspan="3">${pokemonValues.species}</td>
                </tr>
                <tr class="about show">
                    <td>Height</td>
                    <td colspan="3">${pokemonValues.height}</td>
                </tr>
                <tr class="about show">
                    <td>Weight</td>
                    <td colspan="3">${pokemonValues.weight}</td>
                </tr>
                <tr class="about show">
                    <td>Abilities</td>
                    <td colspan="3">${pokemonValues.abilities}</td>
                </tr>                

                <!-- Estatisticas -->
                ${pokemonValues.stats.map((stat) => {
                    tot_stat += Number(stat.base_stat)
                    return `
                        <tr class="base-stats hide">
                            <td class="stat-name">${stat.stat.name}</td>
                            <td class="stat-number">${stat.base_stat}</td>
                            <td class="stat-gauge" colspan="2">
                                <div class="gauge">
                                    <div class="${stat.base_stat > 50 ? 'fill-green' : 'fill-red'}" style="width: ${stat.base_stat -20}%;"></div>
                                </div>
                            </td>
                        </tr>
                    `}).join('')}
                <tr class="base-stats hide">
                    <td class="stat-name">Total</td>
                    <td class="stat-number">${tot_stat}</td>
                    <td class="stat-gauge" colspan="2">
                        <div class="gauge">
                            <div class="${tot_stat > 300 ? 'fill-green' : 'fill-red'}" style="width: ${tot_stat / 6}%;"></div>
                        </div>
                    </td>
                </tr>

                <!-- Movimentos -->
                <tr class="moves hide">
                    <td colspan="4" style="text-align: center">
                        <input type="text" id="autocomplete-input" placeholder="Pesquisar movimento...">
                        <div id="autocomplete-list"></div>
                        <div id="move-details"></div>
                    </td>
            </tbody>
        </table>

        <!-- Type defenses in base stats-->
        <table style="padding: 0 0 4em 0;">
            <tbody>
                <tr class="base-stats hide">
                    <td><h4>Type defenses</h4></td>
                </tr>
                <tr class="base-stats hide text-stype">
                    <td colspan="4">The effectiveness of each type on</td>
                </tr>
            </tbody>    
        </table>
    `
}

function fillValues(pokemonValues){
    const aboutHeaderValsHtml = fillValuesAboutHeaderPokemon(pokemonValues)
    const aboutDetailsValsHtml = fillValuesAboutDetailsPokemon(pokemonValues)

    aboutHeaderValues.innerHTML = aboutHeaderValsHtml;
    aboutDetailsData.innerHTML = aboutDetailsValsHtml;


    changeTableDetails()


    movesAutocompleteSearch(pokemonValues.moves)
}


function changeTableDetails() {

    const headers = document.querySelectorAll('th');

    headers.forEach(header => {
        header.addEventListener('click', function() {
            const section = header.getAttribute('data-section');
            

            const allRows = document.querySelectorAll('tbody tr');

            allRows.forEach(row => {
                row.classList.remove('show');
                row.classList.add('hide')
            })


            const sectionRows = document.querySelectorAll(`tbody tr.${section}`);
            sectionRows.forEach(row => {
                row.classList.add('show');
                row.classList.remove('hide')
            })


            const allMenuItems = document.querySelectorAll(`thead th`)
            allMenuItems.forEach(menuItem => menuItem.classList.remove('active-header'))

            const selectedMenu = document.querySelectorAll(`thead th.${section}`)
            selectedMenu.forEach(menuItem => menuItem.classList.add('active-header'))
        });
    });
}

function movesAutocompleteSearch(moves){
    document.getElementById('autocomplete-input').addEventListener('input', function(e){
      const inputValue = e.target.value;
      const matchingMoves = moves.filter(move => move.move.name.includes(inputValue.toLowerCase()));
      
      const autocompleteList = document.getElementById('autocomplete-list');
      autocompleteList.innerHTML = '';

      for (let move of matchingMoves) {
        const moviesList = document.createElement('div');
        moviesList.innerHTML = move.move.name;
        moviesList.addEventListener('click', function() {
            document.getElementById('autocomplete-input').value = move.move.name;
            displayMoveDetails(move);
            autocompleteList.innerHTML = ''
        })
        autocompleteList.appendChild(moviesList)
      }
    })

    document.addEventListener('click', function(e){
        if (e.target.id !== 'autocomplete-input'){
            document.getElementById('autocomplete-list').innerHTML = ''
        }
    })
}

function displayMoveDetails(move) {
    const detailsDiv = document.getElementById('move-details');
    detailsDiv.innerHTML = ''

    const moveName = document.createElement('h3');
    moveName.textContent = move.move.name;
    detailsDiv.appendChild(moveName);

    const moveURL = document.createElement('a');
    moveURL.href = move.move.url;
    moveURL.textContent = "Move URL";
    moveURL.target = "_blank";
    detailsDiv.appendChild(moveURL);

    const versionGroupDetailsList = document.createElement('ul');
    move.version_group_details.forEach(detail => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            Level: ${detail.level_learned_at}<br>
            Method: <a href="${detail.move_learn_method.url}" target="_blank">${detail.move_learn_method.name}</a><br>
            Version: <a href="${detail.version_group.url}" target="_blank">${detail.version_group.name}</a>
        `;
        versionGroupDetailsList.appendChild(listItem);
    })
    detailsDiv.appendChild(versionGroupDetailsList);
    detailsDiv.style.display = 'block';
}
