import React, { useContext, useState, useEffect } from 'react';
// import styled, { keyframes } from 'styled-components';
import AppContext from '../../AppContext';

//Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import FirestoreService from '../../api/services/FirestoreService';

// Components
import Animales from './Animales';

const Filtros = props => {
  const context = useContext(AppContext);
  const [usuario, setUsuario] = useState(null);
  const [razas, setRazas] = useState([]);
  const [animales, setAnimales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRazas();
  }, []);

  // Firebase
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setUsuario(user.uid);
      console.log('Usuario:', usuario);
    } else {
      setUsuario(null);
      console.log('Usuario no registrado');
    }
  });

  function fetchRazas() {
    setIsLoading(true);
    FirestoreService.getRazas()
      .then(response => {
        setRazas(response._delegate._snapshot.docChanges);
        console.log('Razas:', razas);
        setIsLoading(false);
        fetchPerros();
      })
      .catch(e => {
        setIsLoading(false);
        alert('Error al cargar las razas: ' + e);
      });
  }

  function fetchPerros() {
    setIsLoading(true);
    FirestoreService.getPerros()
      .then(response => {
        setAnimales(response._delegate._snapshot.docChanges);
        console.log('Perros:', razas);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        alert('Error al cargar los perros: ' + e);
      });
  }

  return (
    <>
      <section class="filtros mb-3">
        <div class="col-12 container-size">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb fw-semibold ">
              <li class="breadcrumb-item c">
                <a class="link-primary fs-6" href="#">
                  Home
                </a>
              </li>
              <li class="breadcrumb-item">
                <a class="link-primary" href="#">
                  Animales en adopción
                </a>
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
          <hr />
          <div class="mt-2 mb-2 collapse class-filtros " id="collapseFilter">
            <div class="row row-cols-lg-4 row-cols-1 row-cols-md-2">
              <div class="col">
                <div class="card mb-4 mb-lg-0">
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
                    >
                      <option value="">Indiferente</option>

                      {razas.map(raza => (
                        <option
                          data-tokens={
                            raza.doc.data.value.mapValue.fields.nombre
                              .stringValue
                          }
                          value={
                            raza.doc.data.value.mapValue.fields.key.stringValue
                          }
                        >
                          {
                            raza.doc.data.value.mapValue.fields.nombre
                              .stringValue
                          }
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card mb-4 mb-lg-0">
                  <div class="card-body p-6">
                    <div>
                      <h5 class="mb-3">Tamaño</h5>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
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
                          value=""
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
                          value=""
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
                          value=""
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
                <div class="card mb-4 mb-lg-0">
                  <div class="card-body p-6">
                    <h5 class="mb-3">Sexo</h5>
                    <div class="accordion" id="accordionFlushExample" />

                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="sexo"
                        id="macho"
                      />
                      <label class="form-check-label" for="macho">
                        Macho
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="sexo"
                        id="hembra"
                        checked
                      />
                      <label class="form-check-label" for="hembra">
                        Hembra
                      </label>
                    </div>
                  </div>
                </div>
                <br />
                <div class="card mb-4 mb-lg-0">
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
                            que tienen algun tipo de discapacidad, enfermedad o
                            problema de salud. Otros, pueden tener problemas de
                            comportamiento. <br />{' '}
                            <strong>
                              Antes de adoptar un perro con necesidades
                              especiales, es importante que te asegures de que
                              vas a poder darle los cuidades que este necesite.
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
                        id="ne-no"
                        checked
                      />
                      <label class="form-check-label" for="ne-no">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="card mb-4 mb-lg-0">
                  <div class="card-body p-6">
                    <div>
                      <h5 class="mb-3">Edad</h5>
                      <div>
                        <div class="form-check mb-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="cachorro"
                          />

                          <label class="form-check-label" for="cachorro">
                            Cachorro (0 - 6 meses)
                          </label>
                        </div>
                        <div class="form-check mb-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="joven"
                            checked=""
                          />

                          <label class="form-check-label" for="joven">
                            Joven (6 meses - 2 años)
                          </label>
                        </div>
                        <div class="form-check mb-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="adulto"
                          />

                          <label class="form-check-label" for="adulto">
                            Adulto (2 - 8 años)
                          </label>
                        </div>
                        <div class="form-check mb-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="anciano"
                          />

                          <label class="form-check-label" for="anciano">
                            Anciano (+ 8 años)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col" />
            </div>
            <hr />
          </div>
        </div>
      </section>
      <Animales mascotas={animales} />
    </>
  );
};

export default Filtros;
