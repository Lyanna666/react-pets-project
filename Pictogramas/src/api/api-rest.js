// API REST
// ------------------------------------------------------------

const urlGlobal = 'https://api.arasaac.org/api/pictograms';

const urlAll = '/all/';
const urlBest = '/bestsearch/';
const urlSearch = '/search/';

export async function fetchTodasLasRazas() {
  try {
    const response = await fetch(
      'https://razas-de-perros.p.rapidapi.com/TypeOfBreeds',
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            'b112c1e823msh16c32b1aa504649p12bf44jsn13f26dd51d93',
          'X-RapidAPI-Host': 'razas-de-perros.p.rapidapi.com',
        },
      },
    );
    const pictograms = await response.json();
    return pictograms;
  } catch (error) {
    console.error({ error });
    return error;
    // alert('Ha ocurrido un error:', error);
  }
}

//Cargar todos los pictogramas
export async function fetchAllPictograms(language) {
  try {
    const response = await fetch(urlGlobal + urlAll + language, {
      method: 'GET',
    });
    const pictograms = await response.json();
    return pictograms;
  } catch (error) {
    console.error({ error });
    return error;
    // alert('Ha ocurrido un error:', error);
  }
}

//Esto por ahora no lo estamos usando
export async function fetchAllPictogramsBySearch(search, language) {
  /* console.log(urlAll + language); */

  try {
    const response = await fetch(
      urlGlobal + '/' + language + urlSearch + search,
      {
        method: 'GET',
      },
    );
    const pictograms = await response.json();
    return pictograms;
  } catch (error) {
    console.error({ error });
    return error;
  }
}

// Cargar pictogramas por categorías
export async function fetchPictogramsByCategory(endpoint, language) {
  console.log('***** URL *******', urlGlobal + '/' + language + endpoint);
  try {
    const response = await fetch(urlGlobal + '/' + language + endpoint, {
      method: 'GET',
    });
    const pictograms = await response.json();
    return pictograms;
  } catch (error) {
    console.error({ error });
    return error;
  }
}

//Cargar pictograma por id
export async function fetchPictogramById(language, id) {
  console.log(urlGlobal + '/' + language + '/' + id);

  try {
    const response = await fetch(urlGlobal + '/' + language + '/' + id, {
      method: 'GET',
    });
    const pictograms = await response.json();
    return pictograms;
  } catch (error) {
    console.error({ error });
    return error;
  }
}
