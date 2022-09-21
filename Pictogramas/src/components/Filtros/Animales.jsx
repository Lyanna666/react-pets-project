import React, { useContext, useState, useEffect } from 'react';
// import styled, { keyframes } from 'styled-components';
import AppContext from '../../AppContext';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';

//Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import FirestoreService from '../../api/services/FirestoreService';
import { Link } from 'react-router-dom';

const Animales = props => {
  const context = useContext(AppContext);
  const [usuario, setUsuario] = useState(null);
  const [mascotas, setMascotas] = useState(props.mascotas);
  const [actualizacion, setActualizacion] = useState(1);
  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [vista, setVista] = useState(0);

  console.log(props.mascotas);

  useEffect(
    () => {
      setMascotas(props.mascotas);
    },
    [props.mascotas, props.actualizar],
  );

  useEffect(() => {
    window.addEventListener('storage', () => {
      // When storage changes refetch

      console.log('Cambio favoritos');

      const tempArray = arrayFavoritos();
      console.log(tempArray);
      setFavoritos(tempArray);
    });

    return () => {
      // When the component unmounts remove the event listener
      window.removeEventListener('storage', null);
    };
  }, []);

  useEffect(() => {
    const tempArray = arrayFavoritos();
    console.log(tempArray);
    setFavoritos(tempArray);
  }, []);

  function cambiarVista(event) {
    console.log(event.target.id);
    event.target.id === 'vista-flex' ? setVista(0) : setVista(1);
  }

  const marcarFavorito = (perro, id) => {
    // localStorage.clear();
    console.log(localStorage, '*****', favoritos);
    if (localStorage.getItem(id)) {
      console.log('Favorito remove ', localStorage);
      localStorage.removeItem(id);
    } else {
      localStorage.setItem(id, id);
      console.log('Favorito add', localStorage);
    }

    window.dispatchEvent(new Event('storage'));
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
      <section class="animales mb-3 mt-3 container-size">
        <div class="d-md-flex justify-content-between align-items-center mb-4 mt-0 fs-6">
          <div>
            <p class="mb-3 mb-md-0  ">
              {' '}
              <span class="fw-bold">{mascotas.length}</span>{' '}
              <span class="text-muted">
                {props.perfil
                  ? 'publicaciones'
                  : 'perros disponibles para adoptar'}
              </span>
            </p>
          </div>

          <div class="d-flex justify-content-between align-items-center">
            <button id="vista-lista" class="btn" onClick={cambiarVista}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-list-ul svg-mascota"
                viewBox="0 0 16 16"
                id="vista-lista"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                />
              </svg>
            </button>
            <button id="vista-flex" class="btn" onClick={cambiarVista}>
              <svg
                id="vista-flex"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-grid-3x3-gap svg-mascota"
                viewBox="0 0 16 16"
              >
                <path d="M4 2v2H2V2h2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zM9 2v2H7V2h2zm5 0v2h-2V2h2zM4 7v2H2V7h2zm5 0v2H7V7h2zm5 0h-2v2h2V7zM4 12v2H2v-2h2zm5 0v2H7v-2h2zm5 0v2h-2v-2h2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2z" />
              </svg>
            </button>

            <div>
              <div class="dropdown">
                <button
                  class="btn btn-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Ordenar por
                </button>
                <button
                  class="btn btn-danger m-2"
                  type="button"
                  onClick={props.filtrarPorFavoritos}
                >
                  Ver favoritos {'  '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-heart-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                    />
                  </svg>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <button class="btn" id="nombre" onClick={props.ordenar}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-sort-alpha-down"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"
                        />
                        <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
                      </svg>{' '}
                      Nombre
                    </button>
                  </li>
                  <li>
                    <button class="btn" id="fechaNac" onClick={props.ordenar}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-sort-numeric-down"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z" />
                        <path
                          fill-rule="evenodd"
                          d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"
                        />
                        <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
                      </svg>{' '}
                      Edad
                    </button>
                  </li>
                  <li>
                    <button class="btn" id="raza" onClick={props.ordenar}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-bookmarks-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4z" />
                        <path d="M4.268 1A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L13 13.768V2a1 1 0 0 0-1-1H4.268z" />
                      </svg>{' '}
                      Raza
                    </button>
                  </li>
                  <li>
                    <button class="btn" id="urgente" onClick={props.ordenar}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-heart-pulse-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.475 9C2.702 10.84 4.779 12.871 8 15c3.221-2.129 5.298-4.16 6.525-6H12a.5.5 0 0 1-.464-.314l-1.457-3.642-1.598 5.593a.5.5 0 0 1-.945.049L5.889 6.568l-1.473 2.21A.5.5 0 0 1 4 9H1.475ZM.879 8C-2.426 1.68 4.41-2 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C11.59-2 18.426 1.68 15.12 8h-2.783l-1.874-4.686a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8H.88Z"
                        />
                      </svg>{' '}
                      Urgentes
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            vista === 0
              ? 'd-flex flex-wrap justify-content-center align-items-strech'
              : ''
          }
        >
          {mascotas.map(mascota => (
            <>
              <div
                class={vista === 0 ? 'card m-1' : 'card m-4'}
                style={vista === 0 ? { width: '20rem' } : { width: '100%' }}
              >
                <div class={vista === 1 ? 'row g-0' : 'card-img-top'}>
                  {' '}
                  <div class={vista === 1 ? 'col-md-4' : ''}>
                    <div
                      id={
                        mascota.doc.key.path.segments[6]
                          ? 'id-' + mascota.doc.key.path.segments[6]
                          : ''
                      }
                      class="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div class="carousel-inner">
                        {mascota.doc.data.value.mapValue.fields.img.arrayValue
                          .values ? (
                          mascota.doc.data.value.mapValue.fields.img.arrayValue.values.map(
                            (imagenMascota, index) => {
                              return (
                                <>
                                  {}
                                  <div
                                    class={
                                      index === 0
                                        ? 'carousel-item active'
                                        : 'carousel-item'
                                    }
                                    style={{ height: '15rem' }}
                                  >
                                    {vista === 1 ? (
                                      <>
                                        <img
                                          src={imagenMascota.stringValue}
                                          class="d-block w-100 h-100 dog-img"
                                          alt="..."
                                        />
                                        {mascota.doc.data.value.mapValue.fields
                                          .urgente ? (
                                          mascota.doc.data.value.mapValue.fields
                                            .urgente.stringValue === 'si' ? (
                                            <div class="card-img-overlay  fw-bold text-color-light m-0 p-0">
                                              <div class="card-header text-bg-danger m-0 ">
                                                ¡URGENTE!
                                              </div>
                                              <div />
                                            </div>
                                          ) : (
                                            <></>
                                          )
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <img
                                          src={imagenMascota.stringValue}
                                          class="d-block w-100 h-100 dog-img"
                                          alt="..."
                                        />{' '}
                                        {mascota.doc.data.value.mapValue.fields
                                          .urgente ? (
                                          mascota.doc.data.value.mapValue.fields
                                            .urgente.stringValue === 'si' ? (
                                            <div class="card-img-overlay text-center fw-bold text-color-light m-0 p-0">
                                              <div class="card-header urgente-div text-bg-danger m-0 ">
                                                ¡URGENTE!
                                              </div>
                                            </div>
                                          ) : (
                                            <></>
                                          )
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </>
                              );
                            },
                          )
                        ) : (
                          <>
                            {' '}
                            <div
                              class="carousel-item active"
                              style={{ height: '15rem' }}
                            >
                              <img
                                src="https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
                                class="d-block w-100 h-100 dog-img"
                                alt="..."
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        class="carousel-control-prev"
                        type="button"
                        data-bs-target={
                          '#id-' + mascota.doc.key.path.segments[6]
                        }
                        data-bs-slide="prev"
                      >
                        <span
                          class="carousel-control-prev-icon"
                          aria-hidden="true"
                        />
                        <span class="visually-hidden">Previous</span>
                      </button>
                      <button
                        class="carousel-control-next"
                        type="button"
                        data-bs-target={
                          '#id-' + mascota.doc.key.path.segments[6]
                        }
                        data-bs-slide="next"
                      >
                        <span
                          class="carousel-control-next-icon"
                          aria-hidden="true"
                        />
                        <span class="visually-hidden">Next</span>
                      </button>
                      <span
                        class={
                          vista === 0
                            ? 'position-absolute top-100 start-50 translate-middle badge rounded-pill text-bg-success fs-6 fw-normal'
                            : 'position-absolute top-0 start-50 translate-middle badge rounded-pill text-bg-success fs-6 fw-normal'
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-geo-alt-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                        </svg>
                        {' ' +
                          mascota.doc.data.value.mapValue.fields.localizacion
                            .stringValue}
                      </span>
                    </div>
                  </div>
                  <div class={vista === 1 ? 'col-md-8' : ''}>
                    <div class="card-body mt-2">
                      <a
                        href=""
                        class="fw-light fs-7 w-100 text-decoration-none text-muted mb-3"
                      >
                        {mascota.doc.data.value.mapValue.fields.raza
                          ? mascota.doc.data.value.mapValue.fields.raza
                              .stringValue
                          : ''}
                      </a>
                      <h5 class="card-title fw-bold">
                        {
                          mascota.doc.data.value.mapValue.fields.nombre
                            .stringValue
                        }
                      </h5>

                      <table class="table table-bordered table-sm w-100 mb-3 p-1">
                        <tr>
                          <th class="fw-normal">Sexo:</th>
                          <td class="fw-light">
                            {
                              mascota.doc.data.value.mapValue.fields.Sexo
                                .stringValue
                            }
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">Tamaño: </th>
                          <td class="fw-light">
                            {
                              mascota.doc.data.value.mapValue.fields.Tamaño
                                .stringValue
                            }
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">Año de nacimiento:</th>
                          <td class="fw-light">
                            {mascota.doc.data.value.mapValue.fields.fechaNac
                              ? mascota.doc.data.value.mapValue.fields.fechaNac
                                  .stringValue
                              : ''}
                          </td>
                        </tr>
                      </table>

                      <div className="d-flex justify-content-between">
                        <div>
                          {favoritos.indexOf(
                            mascota.doc.key.path.segments[6],
                          ) >= 0 ? (
                            <>
                              <button
                                onClick={() =>
                                  marcarFavorito(
                                    mascota.doc.data.value.mapValue.fields,
                                    mascota.doc.key.path.segments[6],
                                  )
                                }
                                name={mascota.doc.key.path.segments[6]}
                                type="button"
                                class="btn text-danger"
                              >
                                {' '}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-heart-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                                  />
                                </svg>{' '}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                class="btn text-danger"
                                name={mascota.doc.key.path.segments[6]}
                                onClick={() =>
                                  marcarFavorito(
                                    mascota.doc.data.value.mapValue.fields,
                                    mascota.doc.key.path.segments[6],
                                  )
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-heart-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                </svg>
                              </button>
                            </>
                          )}
                          <button type="button" class="btn ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-share-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
                            </svg>
                          </button>
                        </div>
                        <Link
                          class="btn btn-primary"
                          to={`/perros/${mascota.doc.key.path.segments[6]}`}
                        >
                          Ver detalle
                        </Link>
                      </div>
                      {props.perfil ? (
                        <>
                          {' '}
                          <button
                            type="button"
                            id={mascota.doc.key.path.segments[6]}
                            class="btn w-100 mt-3 btn-danger"
                            onClick={props.eliminarPublicacion}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-trash-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                            {'  '} Eliminar publicación
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </section>
      <dib className="main-bg" />
    </>
  );
};

export default Animales;
