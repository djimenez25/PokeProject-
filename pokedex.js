const urlPokemon = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151`;

let ALL_RESULTS = [];

const typeColors = {
  ice: "#AFEAFD",
  ghost: "#561D25",
  steel: "#1D8A99",
  default: "#2A1A1F",
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
};

const getAllPokemons = async () => {
  const res = await fetch(urlPokemon);
  const data = await res.json();

  extractPokemon(data.results);
};

const extractPokemon = async (pokemons) => {
  for (const pokemon of pokemons) {
    const res = await fetch(pokemon.url);
    const result = await res.json();

    ALL_RESULTS.push(result);
  }
  printPokemon(ALL_RESULTS);
};

const printPokemon = (pokemonToPrint) => {
  const pokedex$$ = document.querySelector(".pokedex");
  pokedex$$.innerHTML = "";

  pokemonToPrint.forEach((pokemon) => {
    const pokemonCard$$ = document.createElement("div");
    pokemonCard$$.classList.add("pokemonCard");
    pokemonCard$$.style.backgroundColor =
      typeColors[pokemon.types[0].type.name];

    const pokemonId$$ = document.createElement("h3");
    pokemonId$$.classList.add("pokemonId");
    pokemonId$$.textContent = pokemon.id;

    const pokemonPhotoContainer$$ = document.createElement("div");
    pokemonPhotoContainer$$.classList.add("pokemonPhotoContainer");

    const pokemonPhoto$$ = document.createElement("img");
    pokemonPhoto$$.classList.add("photo");
    pokemonPhoto$$.setAttribute(
      "src",
      pokemon.sprites.other.dream_world.front_default
    );

    const pokemonName$$ = document.createElement("h2");
    pokemonName$$.classList.add("pokemonName");
    pokemonName$$.textContent = pokemon.name;

    const pokemonStats$$ = document.createElement("div");
    pokemonStats$$.classList.add("poke__stats");

    pokemon.stats.forEach((stat) => {
      const statElement = document.createElement("div");
      const statElementName = document.createElement("div");
      const statElementAmount = document.createElement("div");
      statElement.classList.add("stats__container");
      statElementName.classList.add("stats__name");
      statElementAmount.classList.add("stats__amount");
      statElementName.textContent = `${stat.stat.name} : `;
      statElementAmount.textContent = stat.base_stat;
      statElement.appendChild(statElementName);
      statElement.appendChild(statElementAmount);
      pokemonStats$$.appendChild(statElement);
      pokemonCard$$.appendChild(pokemonStats$$);
    });

    const pokemonTypeContainer$$ = document.createElement("div");
    pokemonTypeContainer$$.classList.add("pokemonTypeContainer");

    pokedex$$.appendChild(pokemonCard$$);
    pokemonCard$$.appendChild(pokemonId$$);
    pokemonCard$$.appendChild(pokemonPhotoContainer$$);
    pokemonPhotoContainer$$.appendChild(pokemonPhoto$$);
    pokemonCard$$.appendChild(pokemonName$$);
    pokemonCard$$.appendChild(pokemonTypeContainer$$);

    getPokemonType(pokemon.types, pokemonTypeContainer$$);

    pokemonCard$$.appendChild(pokemonStats$$);
  });
};

const getPokemonType = async (arrayType, pokemonCard) => {
  if (arrayType.length === 1) {
    const pokemonType1$$ = document.createElement("p");
    pokemonType1$$.textContent = arrayType[0].type.name;
    pokemonCard.appendChild(pokemonType1$$);
  } else if (arrayType.length > 1) {
    const pokemonType1$$ = document.createElement("p");
    pokemonType1$$.textContent = arrayType[0].type.name;
    pokemonCard.appendChild(pokemonType1$$);

    const pokemonType2$$ = document.createElement("p");
    pokemonType2$$.textContent = arrayType[1].type.name;
    pokemonCard.appendChild(pokemonType2$$);
  }
};

const filterPokemons = (event) => {
  const userInput = event.target.value.toLowerCase().trim();

  const filtered = ALL_RESULTS.filter((pokemon) => {
    const matchId = pokemon.id === Number(userInput);
    const matchName = pokemon.name.toLowerCase().includes(userInput);

    return matchId || matchName;
  });

  printPokemon(filtered);
};

const filterPokemonsByType = (type) => {
  if (type === "all") {
    return printPokemon(ALL_RESULTS);
  }

  const filteredByType = ALL_RESULTS.filter((pokemon) => {
    let matchFirstType = false;
    let matchSecondType = false;

    if (pokemon.types[1]) {
      matchSecondType = pokemon.types[1].type.name === type;
    }

    if (pokemon.types[0]) {
      matchFirstType = pokemon.types[0].type.name === type;
    }

    return matchFirstType || matchSecondType;
  });
  printPokemon(filteredByType);
};

document.getElementById("search-input").addEventListener("input", (event) => {
  filterPokemons(event);
});

document.querySelectorAll(".types__selector").forEach((button) => {
  button.addEventListener("click", (event) => {
    filterPokemonsByType(event.target.classList[1]);
  });
});

getAllPokemons();
