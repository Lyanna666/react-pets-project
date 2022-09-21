import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';

import React from 'react';
import { useContext, useState, useEffect } from 'react';

import AppContext from '../AppContext';
import Spinner from '../components/loading/loading';
import firebase from 'firebase/compat/app';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import Animales from '../components/Filtros/Animales';

import FirestoreService from '../api/services/FirestoreService';

const DetallePerro = () => {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [perro, setPerro] = useState(null);
  const [favorito, setFavorito] = useState(false);
  const [imageURL, setImageUrl] = useState(null);

  useEffect(() => {
    fetchPerro();
  }, []);

  useEffect(() => {
    setFavorito(localStorage.getItem(id) ? true : false);
  }, []);

  function fetchPerro() {
    console.log('Detalle perro ', id);
    setIsLoading(true);
    FirestoreService.getPerro(id)
      .then(response => {
        setPerro(response._delegate._document.data.value.mapValue.fields);
        console.log(
          'Detalle perro ',
          id,
          ':',
          response._delegate._document.data.value.mapValue.fields,
        );
        const perroTemporal =
          response._delegate._document.data.value.mapValue.fields;
        setImageUrl(
          perroTemporal.img.arrayValue.values &&
            perroTemporal.img.arrayValue.values.length > 0
            ? perroTemporal.img.arrayValue.values[0].stringValue
            : 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg',
        );

        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        alert('Error al cargar detalle: ' + e);
      });
  }

  const cambiarImagen = event => {
    console.log(event);
    setImageUrl(event.target.currentSrc);
  };

  const enviarFormulario = e => {
    e.preventDefault();
    alert(
      'Se ha enviado tu solicitud. Recuerda que también puedes ponerte en contacto mediante el email y el teléfono de contacto.',
    );
  };

  const marcarFavorito = e => {
    console.log('Boton favorito');
    if (favorito) {
      localStorage.removeItem(id);
      setFavorito(false);
    } else {
      localStorage.setItem(id, id);
      setFavorito(true);
    }
    console.log(localStorage.getItem(id));
  };

  return (
    <>
      <Header />
      {isLoading ? <Spinner allWindow={true} /> : <></>}
      <div class="main-bg" />
      <section class="detalle mb-3 mt-3">
        <div class="col-12 container-size">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb fw-semibold ">
              <li class="breadcrumb-item c">
                <a class="link-primary fs-6" href="#">
                  Home
                </a>
              </li>
              <li class="breadcrumb-item">
                <Link class="link-primary" to={'/perros'}>
                  Perros en adopción
                </Link>
              </li>
              <li class="breadcrumb-item active fw-normal" aria-current="page">
                Detalle
              </li>
            </ol>
          </nav>
        </div>
        {perro ? (
          <section class="container-size">
            <h1 class=" fw-bold">{perro.nombre.stringValue}</h1>
            <div class="card m-4">
              <div class="card-header text-bg-light ">
                <p class="fw-light fs-7 w-100 text-decoration-none text-muted mb-3">
                  {perro.raza ? perro.raza.stringValue : ''}
                </p>
                <h3 class=" fw-bold">{perro.nombre.stringValue}</h3>
              </div>
              <div class="card-img-top">
                <div class="">
                  <div id={'idDetalle-' + id}>
                    {' '}
                    <div class="">
                      {' '}
                      <div style={{ height: '40rem' }}>
                        {' '}
                        <div
                          class="modal modal-xl"
                          tabindex="-1"
                          id="imagen-ampliada"
                        >
                          <div class="modal-dialog ">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title">Imagen ampliada</h5>
                                <button
                                  type="button"
                                  class="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                />
                              </div>
                              <div class="modal-body">
                                <img
                                  class=" m-0 p-0 "
                                  src={
                                    imageURL
                                      ? imageURL
                                      : 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
                                  }
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          class="btn w-100 h-100 p-0 m-0"
                          data-bs-toggle="modal"
                          data-bs-target="#imagen-ampliada"
                        >
                          <img
                            src={imageURL}
                            class="d-block w-100 h-100 dog-img"
                            id="imagen-perro-grande"
                            alt="..."
                          />{' '}
                        </button>{' '}
                        {perro.urgente ? (
                          perro.urgente.stringValue === 'si' ? (
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
                        )}{' '}
                      </div>
                      <div className="d-flex m-2">
                        {perro.img.arrayValue.values ? (
                          perro.img.arrayValue.values.map(
                            (imagenMascota, index) => {
                              return (
                                <>
                                  {}
                                  <button
                                    class="btn m-2"
                                    style={{ height: '10rem' }}
                                    onClick={cambiarImagen}
                                  >
                                    <img
                                      src={imagenMascota.stringValue}
                                      class="d-block w-100 h-100 dog-img"
                                      alt="..."
                                    />
                                  </button>
                                </>
                              );
                            },
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <span
                      class={
                        'position-absolute top-100 start-50 translate-middle badge rounded-pill text-bg-success fs-5 fw-normal'
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
                      {' ' + perro.localizacion.stringValue}
                    </span>
                  </div>
                </div>
                <div>
                  <div class="card-body p-4 m-4">
                    <table class="table  p-4 fs-5 mb-4">
                      <thead>
                        <tr>
                          <th scope="col" colspan="3">
                            Datos
                          </th>
                        </tr>
                      </thead>
                      <tbody class="table-group-divider">
                        <tr>
                          <th class="fw-bold align-top">Nombre:</th>
                          <td class="fw-semibold align-top">
                            {perro.nombre.stringValue}
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-bold align-top">Descripcion:</th>
                          <td class="fw-semibold align-top">
                            {perro.descripcion.stringValue}
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal align-top">
                            Necesidades especiales:
                          </th>
                          <td class="fw-light align-top">
                            {perro.ne.stringValue}
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal align-top">Localizacion:</th>
                          <td class="fw-light align-top">
                            {perro.fechaNac
                              ? perro.localizacion.stringValue
                              : ''}
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal align-top">Sexo:</th>
                          <td class="fw-light align-top">
                            {perro.Sexo.stringValue}
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal align-top">Tamaño: </th>
                          <td class="fw-light align-top">
                            {perro.Tamaño.stringValue}
                          </td>
                        </tr>

                        <tr>
                          <th class="fw-normal align-top">
                            Año de nacimiento:
                          </th>
                          <td class="fw-light align-top">
                            {perro.fechaNac ? perro.fechaNac.stringValue : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="table p-4 fs-5 mt-4">
                      <thead>
                        <tr>
                          <th scope="col" colspan="3">
                            Contacto
                          </th>
                        </tr>
                      </thead>
                      <tbody class="table-group-divider">
                        <tr>
                          <th scope="row">Email:</th>

                          <td>{perro.email.stringValue}</td>
                        </tr>
                        <tr>
                          <th scope="row">Número de teléfono:</th>

                          <td>{perro.tlf.stringValue}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="d-flex justify-content-between mt-4 pt-4">
                      <div>
                        {favorito ? (
                          <button
                            type="button"
                            class="btn text-danger"
                            onClick={marcarFavorito}
                          >
                            {' '}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
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
                        ) : (
                          <button
                            type="button"
                            class="btn text-danger"
                            onClick={marcarFavorito}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              class="bi bi-heart-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                            </svg>
                          </button>
                        )}
                        <button type="button" class="btn ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            class="bi bi-share-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
                          </svg>
                        </button>
                      </div>
                      <div class="modal " tabindex="-1" id="adoptar-modal">
                        <div class="modal-dialog ">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title">Solicitar adopción</h5>
                              <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              />
                            </div>
                            <div class="modal-body m-2">
                              <p>
                                Rellena el formulario, la persona encargada del
                                animal recibirá tu mensaje para ponerse en
                                contacto contigo.
                              </p>
                              <form>
                                <div class="mb-3">
                                  <label
                                    for="nombreContacto"
                                    class="form-label"
                                  >
                                    Nombre completo
                                  </label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="nombreContacto"
                                    placeholder="Nombre"
                                    required
                                  />
                                </div>
                                <div class="mb-3">
                                  <label for="emailContacto" class="form-label">
                                    Correo electrónico
                                  </label>
                                  <input
                                    type="email"
                                    class="form-control"
                                    id="emailContacto"
                                    required
                                    placeholder="Correo electrónico"
                                  />
                                </div>
                                <div class="mb-3">
                                  <label for="msg" class="form-label">
                                    {'Explica los motivos por los que quieres adoptar a ' +
                                      perro.nombre.stringValue +
                                      '.'}
                                  </label>
                                  <textarea
                                    required
                                    class="form-control"
                                    placeholder="¿Por qué quieres adoptar? ¿Has tenido perro alguna vez? ¿Dónde y con quién viviría el animal? ..."
                                    id="msg"
                                    rows="10"
                                  />
                                </div>
                                <div>
                                  <button
                                    type="submit"
                                    class="btn btn-success w-100"
                                  >
                                    Enviar
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        class="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#adoptar-modal"
                      >
                        Solicitar adopción
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <></>
        )}
      </section>

      <Footer />
    </>
  );
};

export default DetallePerro;
