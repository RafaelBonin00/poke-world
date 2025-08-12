import { supabase } from '../../supabaseClient';

const dificuldades = {
  // Geração 1 (Kanto)
  1: 5,   // Bulbasaur
  2: 6,   // Ivysaur
  3: 7,   // Venusaur
  4: 5,   // Charmander
  5: 6,   // Charmeleon
  6: 7,   // Charizard
  7: 5,   // Squirtle
  8: 6,   // Wartortle
  9: 7,   // Blastoise
  10: 1,  // Caterpie
  11: 1,  // Metapod
  12: 2,  // Butterfree
  13: 1,  // Weedle
  14: 1,  // Kakuna
  15: 2,  // Beedrill
  16: 1,  // Pidgey
  17: 2,  // Pidgeotto
  18: 3,  // Pidgeot
  19: 1,  // Rattata
  20: 2,  // Raticate
  21: 1,  // Spearow
  22: 2,  // Fearow
  23: 3,  // Ekans
  24: 4,  // Arbok
  25: 5,  // Pikachu
  26: 6,  // Raichu
  27: 2,  // Sandshrew
  28: 3,  // Sandslash
  29: 2,  // Nidoran♀
  30: 3,  // Nidorina
  31: 5,  // Nidoqueen
  32: 2,  // Nidoran♂
  33: 3,  // Nidorino
  34: 5,  // Nidoking
  35: 2,  // Clefairy
  36: 4,  // Clefable
  37: 2,  // Vulpix
  38: 4,  // Ninetales
  39: 2,  // Jigglypuff
  40: 4,  // Wigglytuff
  41: 1,  // Zubat
  42: 3,  // Golbat
  43: 2,  // Oddish
  44: 3,  // Gloom
  45: 4,  // Vileplume
  46: 1,  // Paras
  47: 2,  // Parasect
  48: 1,  // Venonat
  49: 3,  // Venomoth
  50: 1,  // Diglett
  51: 3,  // Dugtrio
  52: 2,  // Meowth
  53: 3,  // Persian
  54: 2,  // Psyduck
  55: 4,  // Golduck
  56: 2,  // Mankey
  57: 4,  // Primeape
  58: 3,  // Growlithe
  59: 5,  // Arcanine
  60: 2,  // Poliwag
  61: 3,  // Poliwhirl
  62: 5,  // Poliwrath
  63: 2,  // Abra
  64: 4,  // Kadabra
  65: 6,  // Alakazam
  66: 3,  // Machop
  67: 4,  // Machoke
  68: 6,  // Machamp
  69: 2,  // Bellsprout
  70: 3,  // Weepinbell
  71: 4,  // Victreebel
  72: 2,  // Tentacool
  73: 4,  // Tentacruel
  74: 2,  // Geodude
  75: 3,  // Graveler
  76: 5,  // Golem
  77: 2,  // Ponyta
  78: 4,  // Rapidash
  79: 2,  // Slowpoke
  80: 5,  // Slowbro
  81: 2,  // Magnemite
  82: 4,  // Magneton
  83: 3,  // Farfetch'd
  84: 2,  // Doduo
  85: 3,  // Dodrio
  86: 2,  // Seel
  87: 4,  // Dewgong
  88: 2,  // Grimer
  89: 4,  // Muk
  90: 2,  // Shellder
  91: 4,  // Cloyster
  92: 2,  // Gastly
  93: 4,  // Haunter
  94: 6,  // Gengar
  95: 3,  // Onix
  96: 2,  // Drowzee
  97: 4,  // Hypno
  98: 2,  // Krabby
  99: 4,  // Kingler
  100: 2, // Voltorb
  101: 4, // Electrode
  102: 2, // Exeggcute
  103: 5, // Exeggutor
  104: 2, // Cubone
  105: 4, // Marowak
  106: 5, // Hitmonlee
  107: 5, // Hitmonchan
  108: 3, // Lickitung
  109: 2, // Koffing
  110: 4, // Weezing
  111: 2, // Rhyhorn
  112: 4, // Rhydon
  113: 4, // Chansey
  114: 3, // Tangela
  115: 4, // Kangaskhan
  116: 2, // Horsea
  117: 3, // Seadra
  118: 2, // Goldeen
  119: 3, // Seaking
  120: 2, // Staryu
  121: 4, // Starmie
  122: 4, // Mr. Mime
  123: 5, // Scyther
  124: 4, // Jynx
  125: 4, // Electabuzz
  126: 4, // Magmar
  127: 5, // Pinsir
  128: 4, // Tauros
  129: 1, // Magikarp
  130: 7, // Gyarados
  131: 6, // Lapras
  132: 3, // Ditto
  133: 3, // Eevee
  134: 5, // Vaporeon
  135: 5, // Jolteon
  136: 5, // Flareon
  137: 3, // Porygon
  138: 3, // Omanyte
  139: 5, // Omastar
  140: 3, // Kabuto
  141: 5, // Kabutops
  142: 6, // Aerodactyl
  143: 6, // Snorlax
  144: 8, // Articuno
  145: 8, // Zapdos
  146: 8, // Moltres
  147: 4, // Dratini
  148: 6, // Dragonair
  149: 9, // Dragonite
  150: 9, // Mewtwo
  151: 8, // Mew

  // Geração 2 (Johto)
  152: 5,  // Chikorita
  153: 6,  // Bayleef
  154: 7,  // Meganium
  155: 5,  // Cyndaquil
  156: 6,  // Quilava
  157: 7,  // Typhlosion
  158: 5,  // Totodile
  159: 6,  // Croconaw
  160: 7,  // Feraligatr
  161: 1,  // Sentret
  162: 2,  // Furret
  163: 3,  // Hoothoot
  164: 4,  // Noctowl
  165: 2,  // Ledyba
  166: 3,  // Ledian
  167: 2,  // Spinarak
  168: 3,  // Ariados
  169: 4,  // Crobat
  170: 3,  // Chinchou
  171: 4,  // Lanturn
  172: 3,  // Pichu
  173: 2,  // Cleffa
  174: 3,  // Igglybuff
  175: 3,  // Togepi
  176: 4,  // Togetic
  177: 4,  // Natu
  178: 5,  // Xatu
  179: 2,  // Mareep
  180: 3,  // Flaaffy
  181: 5,  // Ampharos
  182: 2,  // Bellossom
  183: 4,  // Marill
  184: 5,  // Azumarill
  185: 2,  // Sudowoodo
  186: 3,  // Politoed
  187: 4,  // Hoppip
  188: 5,  // Skiploom
  189: 6,  // Jumpluff
  190: 3,  // Aipom
  191: 4,  // Sunkern
  192: 5,  // Sunflora
  193: 3,  // Yanma
  194: 6,  // Wooper
  195: 7,  // Quagsire
  196: 5,  // Espeon
  197: 5,  // Umbreon
  198: 4,  // Murkrow
  199: 4,  // Slowking
  200: 3,  // Misdreavus
  201: 5,  // Unown
  202: 2,  // Wobbuffet
  203: 3,  // Girafarig
  204: 5,  // Pineco
  205: 6,  // Forretress
  206: 3,  // Dunsparce
  207: 4,  // Gligar
  208: 6,  // Steelix
  209: 3,  // Snubbull
  210: 4,  // Granbull
  211: 4,  // Qwilfish
  212: 5,  // Scizor
  213: 6,  // Shuckle
  214: 3,  // Heracross
  215: 5,  // Sneasel
  216: 4,  // Teddiursa
  217: 5,  // Ursaring
  218: 2,  // Slugma
  219: 3,  // Magcargo
  220: 4,  // Swinub
  221: 5,  // Piloswine
  222: 2,  // Corsola
  223: 3,  // Remoraid
  224: 4,  // Octillery
  225: 3,  // Delibird
  226: 3,  // Mantine
  227: 5,  // Skarmory
  228: 4,  // Houndour
  229: 5,  // Houndoom
  230: 6,  // Kingdra
  231: 2,  // Phanpy
  232: 3,  // Donphan
  233: 3,  // Porygon2
  234: 4,  // Stantler
  235: 4,  // Smeargle
  236: 2,  // Tyrogue
  237: 3,  // Hitmontop
  238: 3,  // Smoochum
  239: 4,  // Elekid
  240: 4,  // Magby
  241: 5,  // Miltank
  242: 5,  // Blissey
  243: 3,  // Raikou
  244: 3,  // Entei
  245: 3,  // Suicune
  246: 5,  // Larvitar
  247: 6,  // Pupitar
  248: 7,  // Tyranitar
  249: 7,  // Lugia
  250: 7,  // Ho-oh
  251: 8   // Celebi
};


const fetchAndInsertPokemon = async (id, dificuldade) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error(`Erro na API com ID ${id}`);

    const data = await res.json();

    const stats = {};
    data.stats.forEach(stat => {
      stats[stat.stat.name] = stat.base_stat;
    });

    // ➕ Buscar localizações de encontros
    const encountersRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
    const encountersData = encountersRes.ok ? await encountersRes.json() : [];

    // ➕ Extrair nomes das location areas (com ou sem versão)
    const locations = encountersData.map((encounter) => {
      const location = encounter.location_area.name.replace(/-/g, ' ');
      const versions = encounter.version_details.map(v => v.version.name);
      return versions.map(version => `${location} (${version})`);
    }).flat();

    const pokemon = {
      id: data.id,
      name: data.name,
      dificuldade: dificuldade,
      hp: stats['hp'] || 0,
      attack: stats['attack'] || 0,
      defense: stats['defense'] || 0,
      special_attack: stats['special-attack'] || 0,
      special_defense: stats['special-defense'] || 0,
      speed: stats['speed'] || 0,
      height_m: data.height / 10,
      weight_kg: data.weight / 10,
      locations: locations.length > 0 ? locations : null,
    };

    const { error } = await supabase.from('pokemons').upsert(pokemon);
    if (error) console.error(`Erro ao inserir ${data.name}:`, error.message);
    else console.log(`Inserido: ${data.name}`);
  } catch (err) {
    console.error(`Erro com o Pokémon ${id}:`, err.message);
  }
};

const localizacoes = {
  // Geração 1 (001–151)
  1: ['Floresta Norte'],
  2: ['Floresta Norte'],
  3: ['Floresta Norte'],
  4: ['Planície Vulcânica'],
  5: ['Planície Vulcânica'],
  6: ['Montanha Vulcânica'],
  7: ['Costa Oeste'],
  8: ['Costa Oeste'],
  9: ['Costa Oeste'],
  10: ['Floresta Norte'],
  11: ['Floresta Norte'],
  12: ['Floresta Norte'],
  13: ['Floresta Sul'],
  14: ['Floresta Sul'],
  15: ['Floresta Sul'],
  16: ['Vila no Campo'],
  17: ['Vila no Campo'],
  18: ['Vila no Campo'],
  19: ['Campos Floridos'],
  20: ['Campos Floridos'],
  21: ['Campos Floridos'],
  22: ['Campos Floridos'],
  23: ['Deserto'],
  24: ['Deserto'],
  25: ['Região Industrial'],
  26: ['Região Industrial'],
  27: ['Deserto'],
  28: ['Deserto'],
  29: ['Campos Floridos'],
  30: ['Campos Floridos'],
  31: ['Cordilheira de Rochas'],
  32: ['Cordilheira de Rochas'],
  33: ['Cordilheira de Rochas'],
  34: ['Cordilheira de Rochas'],
  35: ['Mansão Abandonada'],
  36: ['Mansão Abandonada'],
  37: ['Planície Vulcânica'],
  38: ['Planície Vulcânica'],
  39: ['Vila no Campo'],
  40: ['Vila no Campo'],
  41: ['Mansão Abandonada'],
  42: ['Mansão Abandonada'],
  43: ['Floresta Norte'],
  44: ['Floresta Norte'],
  45: ['Floresta Norte'],
  46: ['Floresta Sul'],
  47: ['Floresta Sul'],
  48: ['Região Industrial'],
  49: ['Região Industrial'],
  50: ['Deserto'],

  51: ['Deserto'],
  52: ['Vila no Campo'],
  53: ['Vila no Campo'],
  54: ['Costa Oeste'],
  55: ['Costa Oeste'],
  56: ['Vila no Campo'],
  57: ['Vila no Campo'],
  58: ['Planície Vulcânica'],
  59: ['Montanha Vulcânica'],
  60: ['Lago Central'],
  61: ['Lago Central'],
  62: ['Lago Central'],
  63: ['Mansão Abandonada'],
  64: ['Mansão Abandonada'],
  65: ['Ilha Mal Assombrada'],
  66: ['Vila no Campo'],
  67: ['Vila no Campo'],
  68: ['Vila no Campo'],
  69: ['Floresta Norte'],
  70: ['Floresta Norte'],
  71: ['Floresta Norte'],
  72: ['Costa Oeste'],
  73: ['Costa Oeste'],
  74: ['Cordilheira de Rochas'],
  75: ['Cordilheira de Rochas'],
  76: ['Cordilheira de Rochas'],
  77: ['Planície Vulcânica'],
  78: ['Montanha Vulcânica'],
  79: ['Lago Central'],
  80: ['Lago Central'],
  81: ['Região Industrial'],
  82: ['Região Industrial'],
  83: ['Vila no Campo'],
  84: ['Cordilheira de Rochas'],
  85: ['Cordilheira de Rochas'],
  86: ['Costa Oeste'],
  87: ['Costa Oeste'],
  88: ['Região Industrial'],
  89: ['Região Industrial'],
  90: ['Costa Oeste'],
  91: ['Costa Oeste'],
  92: ['Mansão Abandonada'],
  93: ['Mansão Abandonada'],
  94: ['Ilha Mal Assombrada'],
  95: ['Cordilheira de Rochas'],
  96: ['Ilha Mal Assombrada'],
  97: ['Ilha Mal Assombrada'],
  98: ['Costa Oeste'],
  99: ['Costa Oeste'],
  100: ['Região Industrial'],
  101: ['Região Industrial'],
  102: ['Campos Floridos'],
  103: ['Campos Floridos'],
  104: ['Deserto'],
  105: ['Deserto'],
  106: ['Vila no Campo'],
  107: ['Vila no Campo'],
  108: ['Vila no Campo'],
  109: ['Região Industrial'],
  110: ['Região Industrial'],
  111: ['Cordilheira de Rochas'],
  112: ['Cordilheira de Rochas'],
  113: ['Campos Floridos'],
  114: ['Campos Floridos'],
  115: ['Vila no Campo'],
  116: ['Costa Oeste'],
  117: ['Costa Oeste'],
  118: ['Costa Oeste'],
  119: ['Costa Oeste'],
  120: ['Lago Central'],
  121: ['Lago Central'],
  122: ['Ilha Mal Assombrada'],
  123: ['Floresta Norte'],
  124: ['Montanhas Gélidas'],
  125: ['Região Industrial'],
  126: ['Planície Vulcânica'],
  127: ['Floresta Sul'],
  128: ['Campos Floridos'],
  129: ['Lago Central'],
  130: ['Lago Central'],
  131: ['Montanhas Gélidas'],
  132: ['Vila no Campo'],
  133: ['Vila no Campo'],
  134: ['Lago Central'],
  135: ['Região Industrial'],
  136: ['Planície Vulcânica'],
  137: ['Região Industrial'],
  138: ['Costa Oeste'],
  139: ['Costa Oeste'],
  140: ['Cordilheira de Rochas'],
  141: ['Cordilheira de Rochas'],
  142: ['Cordilheira de Rochas'],
  143: ['Vila no Campo'],
  144: ['Montanhas Gélidas'],
  145: ['Região Industrial'],
  146: ['Montanha Vulcânica'],
  147: ['Lago Central'],
  148: ['Lago Central'],
  149: ['Cordilheira de Rochas'],
  150: ['Ilha Mal Assombrada'],
  151: ['Templo Antigo'],

  // Geração 2 (152–251)
  152: ['Floresta Norte'],
  153: ['Floresta Norte'],
  154: ['Floresta Norte'],
  155: ['Planície Vulcânica'],
  156: ['Planície Vulcânica'],
  157: ['Montanha Vulcânica'],
  158: ['Costa Oeste'],
  159: ['Costa Oeste'],
  160: ['Costa Oeste'],
  161: ['Vila no Campo'],
  162: ['Vila no Campo'],
  163: ['Floresta Norte'],
  164: ['Floresta Norte'],
  165: ['Campos Floridos'],
  166: ['Campos Floridos'],
  167: ['Floresta Sul'],
  168: ['Floresta Sul'],
  169: ['Ilha Mal Assombrada'],
  170: ['Lago Central'],
  171: ['Lago Central'],
  172: ['Região Industrial'],
  173: ['Campos Floridos'],
  174: ['Campos Floridos'],
  175: ['Vila no Campo'],
  176: ['Montanhas Gélidas'],
  177: ['Ilha Mal Assombrada'],
  178: ['Ilha Mal Assombrada'],
  179: ['Campos Floridos'],
  180: ['Campos Floridos'],
  181: ['Região Industrial'],
  182: ['Campos Floridos'],
  183: ['Costa Oeste'],
  184: ['Costa Oeste'],
  185: ['Cordilheira de Rochas'],
  186: ['Lago Central'],
  187: ['Deserto'],
  188: ['Deserto'],
  189: ['Campos Floridos'],
  190: ['Vila no Campo'],
  191: ['Campos Floridos'],
  192: ['Campos Floridos'],
  193: ['Floresta Norte'],
  194: ['Lago Central'],
  195: ['Lago Central'],
  196: ['Ilha Mal Assombrada'],
  197: ['Ilha Mal Assombrada'],
  198: ['Ilha Mal Assombrada'],
  199: ['Lago Central'],
  200: ['Mansão Abandonada'],
  201: ['Ilha Mal Assombrada'],
  202: ['Mansão Abandonada'],
  203: ['Ilha Mal Assombrada'],
  204: ['Floresta Sul'],
  205: ['Floresta Sul'],
  206: ['Vila no Campo'],
  207: ['Cordilheira de Rochas'],
  208: ['Cordilheira de Rochas'],
  209: ['Campos Floridos'],
  210: ['Campos Floridos'],
  211: ['Lago Central'],
  212: ['Cordilheira de Rochas'],
  213: ['Cordilheira de Rochas'],
  214: ['Floresta Sul'],
  215: ['Montanhas Gélidas'],
  216: ['Vila no Campo'],
  217: ['Cordilheira de Rochas'],
  218: ['Planície Vulcânica'],
  219: ['Montanha Vulcânica'],
  220: ['Montanhas Gélidas'],
  221: ['Montanhas Gélidas'],
  222: ['Costa Oeste'],
  223: ['Costa Oeste'],
  224: ['Costa Oeste'],
  225: ['Montanhas Gélidas'],
  226: ['Costa Oeste'],
  227: ['Montanhas Gélidas'],
  228: ['Planície Vulcânica'],
  229: ['Montanha Vulcânica'],
  230: ['Lago Central'],
  231: ['Vila no Campo'],
  232: ['Vila no Campo'],
  233: ['Região Industrial'],
  234: ['Campos Floridos'],
  235: ['Vila no Campo'],
  236: ['Vila no Campo'],
  237: ['Vila no Campo'],
  238: ['Montanhas Gélidas'],
  239: ['Montanhas Gélidas'],
  240: ['Planície Vulcânica'],
  241: ['Montanha Vulcânica'],
  242: ['Vila no Campo'],
  243: ['Montanha Vulcânica'],
  244: ['Montanha Vulcânica'],
  245: ['Lago Central'],
  246: ['Cordilheira de Rochas'],
  247: ['Cordilheira de Rochas'],
  248: ['Cordilheira de Rochas'],
  249: ['Ilha Mal Assombrada'],
  250: ['Montanha Vulcânica'],
  251: ['Templo Antigo']
};


export const updateAllTypes = async () => {
  for (let id = 1; id <= 251; id++) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!res.ok) throw new Error(`Erro na API com ID ${id}`);

      const data = await res.json();

      const types = data.types.map(t => t.type.name); // ['grass', 'poison']

      const { error } = await supabase
        .from('pokemons')
        .update({ types })
        .eq('id', id);

      if (error) {
        console.error(`Erro ao atualizar tipos do Pokémon ${id}:`, error.message);
      } else {
        console.log(`Tipos atualizados para o Pokémon ${id}:`, types);
      }

      await new Promise(res => setTimeout(res, 300)); // evitar flood
    } catch (err) {
      console.error(`Erro com o Pokémon ${id}:`, err.message);
    }
  }
};


export const insertAllPokemons = async () => {
  for (let id = 1; id <= 251; id++) {
    const dificuldade = dificuldades[id] || 5;
    await fetchAndInsertPokemon(id, dificuldade);
    await new Promise(res => setTimeout(res, 500)); // evita flood na API
  }
};


const updatePokemonLocation = async (id, newLocations) => {
  const { data, error } = await supabase
    .from('pokemons')
    .update({ locations: newLocations })
    .eq('id', id);

  if (error) {
    console.error(`Erro ao atualizar localização do Pokémon ${id}:`, error.message);
  } else {
    console.log(`Localização atualizada para o Pokémon ${id}:`, newLocations);
  }
};


export const updateAllLocations = async () => {
  for (const id in localizacoes) {
    await updatePokemonLocation(parseInt(id), localizacoes[id]);
    await new Promise(res => setTimeout(res, 300)); // evita flood
  }
};


const updatePokemonDificuldade = async (id, newdificuldade) => {
  const { data, error } = await supabase
    .from('pokemons')
    .update({ dificuldade: newdificuldade })
    .eq('id', id);

  if (error) {
    console.error(`Erro ao atualizar Dificuldade do Pokémon ${id}:`, error.message);
  } else {
    console.log(`Dificuldade atualizada para o Pokémon ${id}:`, newdificuldade);
  }
};


export const updateAllDificuldade = async () => {
  for (const id in dificuldades) {
    await updatePokemonDificuldade(parseInt(id), dificuldades[id]);
    await new Promise(res => setTimeout(res, 300)); // evita flood
  }
};


