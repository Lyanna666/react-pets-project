import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { fetchTodasLasRazas } from '../api/api-rest';
import AppContext from '../AppContext';
import Spinner from '../components/loading/loading';
import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';
import firebase from 'firebase/compat/app';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { createPath } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import 'firebase/compat/auth';
import FirestoreService from '../api/services/FirestoreService';

function NuevaPublicacion() {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [razas, setRazas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sesion Firebase

  useEffect(() => {
    setIsLoading(true);
    firebase.auth().onAuthStateChanged(u => {
      if (u) {
        setUser(u);
        setIsLoading(false);
        console.log(u);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    fetchRazas();
  }, []);

  function fetchRazas() {
    setIsLoading(true);
    fetchTodasLasRazas()
      .then(data => {
        console.log('Data Razas api', data);
        if (Array.isArray(data)) {
          setRazas(data);
          setIsLoading(false);
        } else {
          // setError(data);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }

  const selecionarImagen = event => {
    console.log(event.target.files);
    var file = URL.createObjectURL(event.target.files[0]);
    console.log(file);
    // const arrayimagenes = fotos;

    if (
      event.target.files[0] &&
      event.target.files[0]['type'].split('/')[0] === 'image'
    ) {
      if (fotos.length < 3) {
        // arrayimagenes.push(file);
        setFotos(prevState => [...prevState, file]);
        setFiles(prevState => [...prevState, event.target.files[0]]);
        console.log(fotos);
      } else {
        alert(
          'Como máximo puedes selecionar 3 imágenes. Puedes eliminar alguna de las selecionadas pulsando en la x roja.',
        );
      }
    } else {
      alert('El archivo selecionado no es válido');
    }
  };

  const eliminarFoto = event => {
    event.preventDefault();
    const id = event.target.id;
    setFotos([...fotos.slice(0, Number(id)), ...fotos.slice(Number(id) + 1)]);
    setFiles([...files.slice(0, Number(id)), ...files.slice(Number(id) + 1)]);
    return false;
  };

  const publicarAnuncio = event => {
    event.preventDefault();
    console.log(event.target);
    const {
      nombre,
      descripcion,
      size,
      sexo,
      nacimiento,
      raza,
      ne,
      localizacion,
      urgente,
      tlf,
      email,
    } = event.target.elements;

    const perro = {
      nombre: nombre.value,
      descripcion: descripcion.value,
      tamaño: size.value,
      sexo: sexo.value,
      fechaNac: nacimiento.value,
      img: [],
      ne: ne.value,
      raza: raza.value,
      urgente: urgente.value,
      user: user._delegate.uid,
      tlf: tlf.value,
      email: email.value,
      localizacion: localizacion.value,
    };
    console.log(perro);

    guardarPerro(perro);

    return false;
  };

  function guardarPerro(perro) {
    setIsLoading(true);
    FirestoreService.addPerro(perro)
      .then(response => {
        const idNuevoPerro = response._delegate._key.path.segments[1];
        console.log('Resp:', response, idNuevoPerro);

        files.forEach((file, index) => {
          subirimagen(idNuevoPerro, file, index);
        });
        // navigate('/');
      })
      .catch(e => {
        setIsLoading(false);
        alert('Error al cargar las razas: ' + e);
      });
  }

  const subirimagen = (id, file, index) => {
    setIsLoading(true);
    const storage = firebase.storage();
    const uploadTask = uploadBytesResumable(
      ref(storage, `${id}/${index}`),
      file,
    );
    // .ref(`/images/${user._delegate.uid}`)
    // .put(file);
    uploadTask.on(
      'state_changed',
      snapShot => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      err => {
        //catches the errors
        console.log(err);
        setIsLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(function(url) {
            console.log('URL de la nueva imagen', url);
            const imageURL = url;
            // Now you have valid `imageURL` from async call
            console.log('Imagen subida:', imageURL);
            updatePerro(id, imageURL);
            setIsLoading(false);
            if (index === files.length - 1) {
              alert('Publicación exitosa.');
              navigate('/');
            }
          })
          .catch(function(error) {
            console.log(error);
            setIsLoading(false);
            return null;
          });
      },
    );
  };

  function updatePerro(perroId, urlFotos) {
    setIsLoading(true);
    console.log('URLFOTOS:', urlFotos);
    FirestoreService.updateFotosPerros(urlFotos, perroId)
      .then(response => {
        console.log('Update foto', urlFotos);
      })
      .catch(e => {
        setIsLoading(false);
        alert('Error al subir imagen: ' + e);
      });
  }

  return (
    <>
      <div className="main-bg" />
      <Header />
      {isLoading ? <Spinner allWindow={true} /> : <></>}
      <>
        {user === null ? (
          <>
            <h1>Usuario null</h1>
          </>
        ) : (
          <>
            {' '}
            <div class="container-size p-4">
              <div class="card m-4">
                <div class="card-header border-0 p-4">
                  <h1 class="h4 card-title mb-0 fw-bold">Nueva publicación</h1>
                </div>

                <div class="card-body">
                  <form class="row g-3" onSubmit={publicarAnuncio}>
                    <div class="col-12">
                      <h5 class="card-title mb-0 fw-semibold">
                        Datos del animal
                      </h5>
                    </div>
                    <div class="col-12">
                      <label class="form-label">Nombre del perro</label>
                      <input
                        name="nombre"
                        type="text"
                        class="form-control"
                        placeholder="Nombre del perro"
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Descripción</label>
                      <textarea
                        class="form-control"
                        rows="3"
                        name="descripcion"
                        placeholder="Descripción"
                      />
                      <p class="text-muted fs-7 m-1 ml-2">
                        Límite 300 caracteres
                      </p>
                    </div>
                    <div class="col-sm-6 col-lg-4">
                      <label class="form-label">Tamaño</label>
                      <select
                        name="size"
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="Pequeño" selected>
                          Pequeño (3 - 10kg)
                        </option>
                        <option value="Mediano">Mediano (10 - 25kg)</option>
                        <option value="Grande">Grande (25 - 50kg)</option>
                        <option value="Gigante">Gigante (+ 50kg)</option>
                      </select>
                    </div>
                    <div class="col-sm-6 col-lg-4">
                      <label class="form-label">Sexo</label>
                      <select
                        name="sexo"
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="Macho" selected>
                          Macho
                        </option>
                        <option value="Hembra">Hembra</option>
                      </select>
                    </div>
                    <div class="col-sm-6 col-lg-4">
                      <label class="form-label">Año de nacimiento</label>
                      <input
                        name="nacimiento"
                        class="form-control"
                        type="number"
                        min="2000"
                        max="2022"
                        step="1"
                        defaultValue="2016"
                      />
                    </div>
                    <div class="col-sm-6">
                      <label class="form-label">Raza</label>
                      <select
                        name="raza"
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="Sin raza">
                          Sin raza / Otra / Cruce
                        </option>
                        {razas.map(raza => (
                          <option data-tokens={raza.name} value={raza.name}>
                            {raza.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="col-lg-6">
                      <label class="form-label">Necesidades especiales</label>
                      <select
                        name="ne"
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="si" selected>
                          Sí
                        </option>
                        <option selected value="no">
                          No
                        </option>
                      </select>
                      <p class="text-muted fs-7 m-1 ml-2">
                        En caso afirmativo, recuerda especificar las necesidades
                        especiales del animal en la descripción.
                      </p>
                    </div>

                    <div class="col-12">
                      <label class="form-label">Fotografías</label>
                      <input
                        type="file"
                        class="form-control"
                        style={{ color: 'transparent' }}
                        onChange={selecionarImagen}
                      />
                      <p class="text-muted fs-7 m-1 ml-2">
                        Seleciona como máximo 3 fotografías del animal.
                      </p>
                    </div>
                    <div class="col-12 d-flex">
                      {fotos.map((foto, index) => (
                        <div class="card usuario-img">
                          <span class="position-absolute top-0 end-0 badge rounded-pill">
                            <button
                              type="button"
                              id={index}
                              class="btn btn-danger rounded-circle"
                              onClick={eliminarFoto}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-x-lg"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                              </svg>
                            </button>{' '}
                          </span>
                          <img
                            src={foto}
                            class="d-block w-100 h-100  dog-img"
                            alt="Foto selecionada"
                          />
                        </div>
                      ))}
                    </div>
                    <hr />
                    <div class="col-12">
                      <h5 class="card-title mb-0 fw-semibold">Otros datos</h5>
                    </div>
                    <div class="col-sm-6">
                      <label class="form-label">Localización</label>
                      <div class="input-group">
                        <span class="input-group-text border-0">
                          {' '}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-geo-alt-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                          </svg>{' '}
                        </span>
                        <select
                          name="localizacion"
                          class="form-select"
                          aria-label="Default select example"
                        >
                          <option value="A Coruña">A Coruña</option>
                          <option value="Álava">Álava</option>
                          <option value="Albacete">Albacete</option>
                          <option value="Alicante">Alicante</option>
                          <option value="Almería">Almería</option>
                          <option value="Asturias">Asturias</option>
                          <option value="Ávila">Ávila</option>
                          <option value="Badajoz">Badajoz</option>
                          <option value="Barcelona">Barcelona</option>
                          <option value="Burgos">Burgos</option>
                          <option value="Cáceres">Cáceres</option>
                          <option value="Cádiz">Cádiz</option>
                          <option value="Cantabria">Cantabria</option>
                          <option value="Castellón">Castellón</option>
                          <option value="Ceuta">Ceuta</option>
                          <option value="Ciudad Real">Ciudad Real</option>
                          <option value="Córdoba">Córdoba</option>
                          <option value="Cuenca">Cuenca</option>
                          <option value="Gerona">Gerona</option>
                          <option value="Girona">Girona</option>
                          <option value="Las Palmas">Las Palmas</option>
                          <option value="Granada">Granada</option>
                          <option value="Guadalajara">Guadalajara</option>
                          <option value="Guipúzcoa">Guipúzcoa</option>
                          <option value="Huelva">Huelva</option>
                          <option value="Huesca">Huesca</option>
                          <option value="Jaén">Jaén</option>
                          <option value="La Rioja">La Rioja</option>
                          <option value="León">León</option>
                          <option value="Lleida">Lleida</option>
                          <option value="Lugo">Lugo</option>
                          <option selected value="Madrid">
                            Madrid
                          </option>
                          <option value="Malaga">Málaga</option>
                          <option value="Mallorca">Mallorca</option>
                          <option value="Melilla">Melilla</option>
                          <option value="Murcia">Murcia</option>
                          <option value="Navarra">Navarra</option>
                          <option value="Orense">Orense</option>
                          <option value="Palencia">Palencia</option>
                          <option value="Pontevedra">Pontevedra</option>
                          <option value="Salamanca">Salamanca</option>
                          <option value="Segovia">Segovia</option>
                          <option value="Sevilla">Sevilla</option>
                          <option value="Soria">Soria</option>
                          <option value="Tarragona">Tarragona</option>
                          <option value="Tenerife">Tenerife</option>
                          <option value="Teruel">Teruel</option>
                          <option value="Toledo">Toledo</option>
                          <option value="Valencia">Valencia</option>
                          <option value="Valladolid">Valladolid</option>
                          <option value="Vizcaya">Vizcaya</option>
                          <option value="Zamora">Zamora</option>
                          <option value="Zaragoza">Zaragoza</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <label class="form-label">
                        ¿Se trata de un caso urgente?
                      </label>
                      <div class="input-group">
                        <span class="input-group-text border-0">
                          {' '}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-exclamation-triangle-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                          </svg>{' '}
                        </span>
                        <select
                          name="urgente"
                          class="form-select"
                          aria-label="Default select example"
                        >
                          <option value="no">No</option>
                          <option value="si">Sí</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <label class="form-label">Teléfono de contacto</label>
                      <div class="input-group">
                        <span class="input-group-text border-0">
                          {' '}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-telephone-fill"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                            />
                          </svg>{' '}
                        </span>
                        <input
                          name="tlf"
                          type="text"
                          class="form-control"
                          placeholder="Teléfono de contacto"
                          defaultValue={
                            user._delegate.phoneNumber
                              ? user._delegate.phoneNumber
                              : ''
                          }
                        />
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <label class="form-label">Email de contacto</label>
                      <div class="input-group">
                        <span class="input-group-text border-0">
                          {' '}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-envelope"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                          </svg>{' '}
                        </span>
                        <input
                          name="email"
                          type="email"
                          class="form-control"
                          placeholder="Email de contacto"
                          defaultValue={user._delegate.email}
                        />
                      </div>
                    </div>
                    <div class="col-12 text-end">
                      <button type="submit" class="btn btn-primary mb-0">
                        Publicar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </>

      <Footer />
    </>
  );
}

export default NuevaPublicacion;
