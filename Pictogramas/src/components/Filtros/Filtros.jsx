import React, { useContext, useState, useEffect } from 'react';
// import styled, { keyframes } from 'styled-components';
import AppContext from '../../AppContext';
import Spinner from '../loading/loading';

import { fetchTodasLasRazas } from '../../api/api-rest';
import { Link } from 'react-router-dom';
//Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import FirestoreService from '../../api/services/FirestoreService';

// Components
import Animales from './Animales';

const Filtros = props => {
  const context = useContext(AppContext);
  const [usuario, setUsuario] = useState(null);
  const [actualizar, setActualizar] = useState(1);
  const [razas, setRazas] = useState([]);
  const [animales, setAnimales] = useState([]);
  const [animalesFiltrados, setAnimalesFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // getRazas();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    firebase.auth().onAuthStateChanged(u => {
      setIsLoading(true);
      if (u) {
        setUsuario(u.uid);
        console.log('Usuario:', u);
        getRazas();

        setIsLoading(false);
      } else {
        setUsuario(null);
        setIsLoading(false);
        getRazas();
      }
    });
  }, []);

  function getRazas() {
    setIsLoading(true);
    fetchTodasLasRazas()
      .then(data => {
        console.log('Data Razas api', data);
        if (Array.isArray(data)) {
          setRazas(data);
          // setIsLoading(false);
          fetchPerros();
        } else {
          // setError(data);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
        fetchPerros();
      });
  }

  function fetchPerros() {
    setIsLoading(true);
    FirestoreService.getPerros()
      .then(response => {
        setAnimales(response._delegate._snapshot.docChanges);
        setAnimalesFiltrados(response._delegate._snapshot.docChanges);
        console.log('Perros:', razas);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        alert('Error al cargar los perros: ' + e);
      });
  }

  function fetchPerrosOrdenados(ordenId) {
    setIsLoading(true);
    FirestoreService.getPerrosOrder(ordenId)
      .then(response => {
        setAnimales(response._delegate._snapshot.docChanges);
        setAnimalesFiltrados(response._delegate._snapshot.docChanges);
        console.log('Perros:', animales);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        alert('Error al cargar los perros: ' + e);
      });
  }

  const ordenarPor = event => {
    console.log('Ordenar por', event.target.id);
    fetchPerrosOrdenados(event.target.id);
    window.refresh();
  };

  const filtrarAnimales = event => {
    event.preventDefault();
    const {
      raza,
      pequeño,
      grande,
      mediano,
      gigante,
      macho,
      hembra,
      ne,
    } = event.target.elements;

    console.log(
      'Filtros',
      hembra.value,
      macho.value,
      raza.value,
      pequeño.value,
      mediano.value,
      grande.value,
      gigante.value,
      ne.value,
    );

    let arrayTemp = animales;

    //Sexo
    if (hembra.checked) {
      arrayTemp = arrayTemp.filter(
        perro =>
          perro.doc.data.value.mapValue.fields.Sexo.stringValue ===
          hembra.value,
      );
      console.log('Hembra checked:', arrayTemp);
    }

    if (macho.checked) {
      arrayTemp = arrayTemp.filter(
        perro =>
          perro.doc.data.value.mapValue.fields.Sexo.stringValue === macho.value,
      );
      console.log('Macho checked:', arrayTemp);
    }

    // Raza
    if (raza.value && raza.value.length > 1) {
      arrayTemp = arrayTemp.filter(
        perro =>
          perro.doc.data.value.mapValue.fields.raza.stringValue === raza.value,
      );
      console.log(arrayTemp);
    }

    // Tamaño
    if (pequeño.checked) {
      arrayTemp = arrayTemp.filter(
        perro =>
          perro.doc.data.value.mapValue.fields.Tamaño.stringValue ===
          pequeño.value,
      );
    }
    if (grande.checked) {
      arrayTemp = arrayTemp.filter(
        perro =>
          perro.doc.data.value.mapValue.fields.Tamaño.stringValue ===
          grande.value,
      );
    }

    if (mediano.checked) {
      arrayTemp = arrayTemp.filter(
        perro =>
          perro.doc.data.value.mapValue.fields.Tamaño.stringValue ===
          mediano.value,
      );
    }
    if (gigante.checked) {
      arrayTemp = arrayTemp.filter(
        perro =>
          perro.doc.data.value.mapValue.fields.Tamaño.stringValue ===
          gigante.value,
      );
    }

    //NE

    if (ne.value) {
      arrayTemp = arrayTemp.filter(
        perro =>
          perro.doc.data.value.mapValue.fields.ne.stringValue === ne.value,
      );
    }

    if (arrayTemp.length > 0) {
      setAnimalesFiltrados([...arrayTemp]);
    } else {
      alert('No hay perros con los filtros selecionados');
    }

    setActualizar(2);

    return false;
  };

  const eliminarFiltros = event => {
    setAnimalesFiltrados([...animales]);
    setActualizar(0);
  };

  const filtrarPorFavoritos = event => {
    if (actualizar === 17) {
      setAnimalesFiltrados([...animales]);

      setActualizar(11);
    } else {
      let arrayLocalStorage = arrayFavoritos();

      let arrayTemp = animales;
      const arrayFiltrado = arrayTemp.filter(perro =>
        arrayLocalStorage.includes(perro.doc.key.path.segments[6]),
      );
      console.log('Array Filtrado***', arrayFiltrado, event.target);
      setAnimalesFiltrados([...arrayFiltrado]);

      setActualizar(17);
    }
  };

  const arrayFavoritos = () => {
    let tempArray = [];
    Object.keys(localStorage).forEach(data => {
      let item = localStorage.getItem(data);
      tempArray.push(item);
    });

    return tempArray;
  };

  return (
    <>
      {isLoading ? <Spinner allWindow={true} /> : <></>}
      <section class="filtros mb-3 mt-3">
        <div class="col-12 container-size">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb fw-semibold ">
              <li class="breadcrumb-item c">
                <Link class="link-primary fs-6" to={'/'}>
                  Home
                </Link>
              </li>

              <li class="breadcrumb-item active fw-normal" aria-current="page">
                Perros
              </li>
            </ol>
          </nav>
          <a
            class="btn btn btn-outline-secondary collapsed"
            data-bs-toggle="collapse"
            href="#collapseFilter"
            role="button"
            aria-expanded="false"
            aria-controls="collapseFilter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-filter me-2"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>{' '}
            Filtrar
          </a>
          <hr class="mb-0" />
          <div
            class="mt-0 mb-2 p-3 collapse class-filtros border bg-white collapse-div"
            id="collapseFilter"
          >
            <form onSubmit={filtrarAnimales}>
              <div class="row row-cols-lg-4 row-cols-1 row-cols-md-2 ">
                <div class="col">
                  <div class=" mb-4 mb-lg-0">
                    <div class="card-body p-6">
                      <h5 class="mb-3">Razas</h5>
                      <div
                        class="alert alert-primary alert-dismissible align-items-center"
                        role="alert"
                      >
                        <div>
                          <span class="m-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="currentColor"
                              class="bi bi-exclamation-circle"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                            </svg>
                          </span>
                          Seleciona una o varias razas de perro.
                        </div>
                      </div>
                      {/* <div class="form-floating mb-3">
                      <input
                        class="form-control"
                        id="floatingInput"
                        placeholder="Raza"
                      />
                      <label for="floatingInput">Buscar raza</label>
                    </div> */}
                      <select
                        class="form-select"
                        multiple
                        aria-label="multiple select example"
                        name="raza"
                      >
                        <option value="">Indiferente</option>

                        {razas.map(raza => (
                          <option data-tokens={raza.name} value={raza.name}>
                            {raza.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class=" mb-4 mb-lg-0">
                    <div class="card-body p-6">
                      <div>
                        <h5 class="mb-3">Tamaño</h5>
                        <div class="form-check mb-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            name="pequeño"
                            value="Pequeño"
                            id="peque"
                          />
                          <label class="form-check-label" for="peque">
                            Pequeño (3 - 10kg)
                          </label>
                        </div>
                        <div class="form-check mb-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            name="mediano"
                            value="Mediano"
                            id="mediano"
                          />
                          <label class="form-check-label" for="mediano">
                            Mediano (10 - 25kg)
                          </label>
                        </div>
                        <div class="form-check mb-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value="Grande"
                            name="grande"
                            id="grande"
                          />
                          <label class="form-check-label" for="grande">
                            Grande (25 - 50kg)
                          </label>
                        </div>
                        <div class="form-check mb-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            name="gigante"
                            value="Gigante"
                            id="gigante"
                          />
                          <label class="form-check-label" for="gigante">
                            Gigante (+ 50kg)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class=" mb-4 mb-lg-0">
                    <div class="card-body p-6">
                      <h5 class="mb-3">Necesidades especiales</h5>
                      <div class="accordion" id="accordionFlushExample">
                        <div class="accordion-item ">
                          <h2 class="accordion-header" id="flush-headingOne">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseOne"
                              aria-expanded="false"
                              aria-controls="flush-collapseOne"
                            >
                              Información
                            </button>
                          </h2>
                          <div
                            id="flush-collapseOne"
                            class="accordion-collapse collapse"
                            aria-labelledby="flush-headingOne"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div class="accordion-body">
                              Los perros con necesidades especiales son aquellos
                              que tienen algun tipo de discapacidad, enfermedad
                              o problema de salud. Otros, pueden tener problemas
                              de comportamiento. <br />{' '}
                              <strong>
                                Antes de adoptar un perro con necesidades
                                especiales, es importante que te asegures de que
                                vas a poder darle los cuidades que este
                                necesite.
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="ne"
                          value="si"
                          id="ne-si"
                        />
                        <label class="form-check-label" for="ne-si">
                          Sí
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="ne"
                          value="no"
                          id="ne-no"
                          checked
                        />
                        <label class="form-check-label" for="ne-no">
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                  <br />
                </div>

                <div class="col">
                  {' '}
                  <div class=" mb-4 mb-lg-0">
                    <div class="card-body p-6">
                      <h5 class="mb-3">Sexo</h5>
                      <div class="accordion" id="accordionFlushExample" />

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          name="macho"
                          value="Macho"
                          id="macho"
                        />
                        <label class="form-check-label" for="macho">
                          Macho
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          name="hembra"
                          value="Hembra"
                          id="hembra"
                        />
                        <label class="form-check-label" for="hembra">
                          Hembra
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col" />
              </div>
              <div class="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-danger m-2"
                  onClick={eliminarFiltros}
                >
                  Eliminar filtros
                </button>
                <button type="submit" class="btn btn-success m-2">
                  Filtrar
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="dibujo-filtro" />
      </section>
      <Animales
        mascotas={animalesFiltrados}
        actualizar={actualizar}
        ordenar={ordenarPor}
        filtrarPorFavoritos={filtrarPorFavoritos}
      />
    </>
  );
};

export default Filtros;
