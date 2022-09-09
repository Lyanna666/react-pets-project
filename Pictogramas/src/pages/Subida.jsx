import React from 'react';
import { useContext, useState } from 'react';

import AppContext from '../AppContext';
import Loading from '../components/loading/loading';
import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';
import firebase from 'firebase/compat/app';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { createPath } from 'react-router-dom';

function Subida() {
  const context = useContext(AppContext);
  const [imageAsUrl, setImageAsUrl] = useState('');
  const [validate, setValidated] = useState(false);
  const [user, setUser] = useState(null);
  const [editando, setEditando] = useState(false);
  const [storageRef, setStorageRef] = useState(null);

  const handleInputChange = event => {
    const name = event.target.value;
  };

  // Sesion Firebase
  firebase.auth().onAuthStateChanged(u => {
    if (u) {
      setUser(u);
      setImageAsUrl(u._delegate.photoURL);
      console.log(u);
    } else {
      setUser(null);
    }
  });

  const iniciarSesion = e => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    console.log(e.target.elements);
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(userCredentails => {
        var user = userCredentails.user;
        alert('Login correcto');
        setUser(user);
        setValidated(true);
      })
      .catch(e => {
        alert(e.message);
        setValidated(true);
      });
  };

  const registrarse = e => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    console.log(e.target.elements);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then(userCredentails => {
        var user = userCredentails.user;
        alert('Registro correcto');
        setUser(user);
        setValidated(true);
      })
      .catch(e => {
        alert(e.message);
        setValidated(true);
      });
  };

  const cerrarSesion = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        //Signout Successful
        alert('Logout Successful');
        setUser(null);
        setValidated(false);
      })
      .catch(e => {
        alert(e.message);
      });
  };

  const cambiarImagenPerfil = event => {
    console.log(event);
    var file = event.target.files[0];
    console.log(file);
    const storage = firebase.storage();
    const uploadTask = uploadBytesResumable(
      ref(storage, `/usuarios/${user._delegate.uid}/perfil`),
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
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        // storage
        //   .ref('images')
        //   .child(user._delegate.uid)
        //   .getDownloadURL()
        //   .then(fireBaseUrl => {
        //     setImageAsUrl(prevObject => ({
        //       ...prevObject,
        //       imgUrl: fireBaseUrl,
        //     }));
        //   });
        // getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
        //   setImageAsUrl(downloadURL);
        // });
        getDownloadURL(uploadTask.snapshot.ref)
          .then(function(url) {
            console.log('URL de la nueva imagen', url);
            const imageURL = url;

            // Now you have valid `imageURL` from async call
            var usuarioModificado = user;
            console.log('Usuario a modificar:', usuarioModificado);
            usuarioModificado
              .updateProfile({ photoURL: imageURL })
              .then(function() {
                console.log('Usuario modificado:', usuarioModificado);
                setUser(user);
                setImageAsUrl(imageURL);
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(function(error) {
            console.log(error);
          });
      },
    );
  };

  function complete(upload) {
    storageRef
      .getDownloadURL(upload)
      .then(function(url) {
        console.log(url);
        const imageURL = url;

        // Now you have valid `imageURL` from async call
        var user = firebase.auth.currentUser;
        user
          .updateProfile({ photoURL: imageURL })
          .then(function() {
            console.log(user);
            setUser(user);
            setImageAsUrl(imageURL);
          })
          .catch(function(error) {
            console.log(error);
          });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  return (
    <>
      <Header />

      {user === null ? (
        <>
          <div className="container-size mt-4 mb-4">
            <div class="row justify-content-center align-items-center m-4">
              <div class="col-12 col-md-6 col-lg-4 order-lg-1 order-2 card p-4">
                {/* <img
                  src="https://media-public.canva.com/U7YhY/MAD9WpU7YhY/1/tl.png"
                  alt=""
                  class="img-fluid"
                /> */}
                <div class="mb-lg-9 mb-5">
                  <h1 class="mb-1 h2 fw-normal">Login</h1>
                  <p class="fw-normal">
                    Inicia sesión en <span class="fw-bold">Adogta</span> para
                    publicar anuncios y guardar en favoritos.
                  </p>
                </div>

                <form onSubmit={iniciarSesion}>
                  <div class="row g-3">
                    <div class="col-12">
                      <input
                        type="email"
                        class="form-control"
                        id="inputEmail4"
                        placeholder="Email"
                        name="email"
                        required
                      />
                    </div>
                    <div class="col-12">
                      <input
                        type="password"
                        class="form-control"
                        id="inputPassword4"
                        name="password"
                        placeholder="Contraseña"
                        required
                      />
                    </div>
                    <div class="d-flex justify-content-between">
                      <div>
                        ¿Has olvidado tu contraseña? {'  '}
                        <a
                          class="link-primary fw-bold"
                          href="../pages/forgot-password.html"
                        >
                          Recuperar
                        </a>
                      </div>
                    </div>
                    <div class="col-12 d-grid">
                      {' '}
                      <button type="submit" class="btn btn-primary">
                        Inciar sesión
                      </button>
                    </div>
                    <div>
                      ¿Todavía no estás registrado? {'  '}
                      <a
                        class="link-primary fw-bold"
                        href="../pages/signup.html"
                      >
                        {' '}
                        ¡Regístrate ahora!
                      </a>
                    </div>
                  </div>
                </form>
              </div>

              <div class="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1 card p-4">
                <div class="mb-lg-9 mb-5">
                  <h1 class="mb-1 h2 fw-normal">Registro</h1>
                </div>

                <form>
                  <div class="row g-3">
                    <div class="col-12">
                      <input
                        type="email"
                        class="form-control"
                        id="inputEmail4"
                        placeholder="Email"
                        required=""
                      />
                    </div>
                    <div class="col-12">
                      <input
                        type="password"
                        class="form-control"
                        id="inputPassword4"
                        placeholder="Contraseña"
                        required=""
                      />
                    </div>
                    <div class="col-12">
                      <input
                        type="password"
                        class="form-control"
                        id="inputPassword4"
                        placeholder="Confirmar contraseña"
                        required=""
                      />
                    </div>
                    <div class="d-flex justify-content-between">
                      <div>
                        ¿Has olvidado tu contraseña? {'  '}
                        <a
                          class="link-primary fw-bold"
                          href="../pages/forgot-password.html"
                        >
                          Recuperar
                        </a>
                      </div>
                    </div>
                    <div class="col-12 d-grid">
                      {' '}
                      <button type="submit" class="btn btn-primary">
                        Inciar sesión
                      </button>
                    </div>
                    <div>
                      ¿Todavía no estás registrado? {'  '}
                      <a
                        class="link-primary fw-bold"
                        href="../pages/signup.html"
                      >
                        {' '}
                        ¡Regístrate ahora!
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="container-size mt-4 mb-4">
            <div class="card">
              <div class="h-200px rounded-top usuario-banner" />

              <div class="card-body py-0">
                <div class="d-sm-flex align-items-start text-center text-sm-start">
                  <div>
                    <div class="avatar avatar-xxl mt-n5 mb-3">
                      <span class="position-absolute top-0 end-0 badge rounded-pill">
                        <button class="btn btn-light btn-sm rounded-circle">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-pencil-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                          </svg>
                        </button>
                      </span>

                      <div class="custom-btn-img usuario-img-div">
                        <span class="position-absolute top-0 end-0 badge rounded-pill">
                          <label for="file-upload" class="custom-file-upload">
                            <div class="btn btn-light btn-sm rounded-circle">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-pencil-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                              </svg>
                            </div>
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            onInput={cambiarImagenPerfil}
                          />
                        </span>
                        <img
                          class="avatar-img rounded-circle border border-white border-3 usuario-img"
                          src={
                            imageAsUrl
                              ? imageAsUrl
                              : 'https://cdn-icons-png.flaticon.com/512/3093/3093444.png'
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div class="ms-sm-4 mt-sm-3">
                    {!editando ? (
                      <>
                        <h1 class="mb-0 h5 fw-bold">
                          {user._delegate.displayName
                            ? user._delegate.displayName
                            : 'Usuario'}
                        </h1>
                        <p class="fw-light">
                          {user._delegate.email
                            ? user._delegate.email
                            : 'Email no registrado'}
                        </p>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          class="form-control mb-0 h5 fw-bold"
                          value={
                            user._delegate.displayName
                              ? user._delegate.displayName
                              : 'Usuario'
                          }
                        />
                        <input
                          type="text"
                          class="fw-light form-control"
                          value={
                            user._delegate.email
                              ? user._delegate.email
                              : 'Email no registrado'
                          }
                        />
                      </>
                    )}
                  </div>

                  <div class="d-flex mt-3 justify-content-center ms-sm-auto">
                    <button class="btn btn-danger-soft me-2" type="button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-pencil-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                      </svg>{' '}
                      Modificar perfil
                    </button>
                    <div class="dropdown">
                      <button
                        class="icon-md btn btn-light"
                        type="button"
                        id="profileAction2"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i class="bi bi-three-dots" />
                      </button>

                      <ul
                        class="dropdown-menu dropdown-menu-end"
                        aria-labelledby="profileAction2"
                      >
                        <li>
                          <a class="dropdown-item" href="#">
                            {' '}
                            <i class="bi bi-bookmark fa-fw pe-2" />
                            Share profile in a message
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#">
                            {' '}
                            <i class="bi bi-file-earmark-pdf fa-fw pe-2" />
                            Save your profile to PDF
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#">
                            {' '}
                            <i class="bi bi-lock fa-fw pe-2" />
                            Lock profile
                          </a>
                        </li>
                        <li>
                          <hr class="dropdown-divider" />
                        </li>
                        <li>
                          <a class="dropdown-item" href="#">
                            {' '}
                            <i class="bi bi-gear fa-fw pe-2" />
                            Profile settings
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <ul class="list-inline mb-0 text-center text-sm-start mt-3 mt-sm-0">
                  <li class="list-inline-item">
                    <i class="bi bi-briefcase me-1" /> Lead Developer
                  </li>
                  <li class="list-inline-item">
                    <i class="bi bi-geo-alt me-1" /> New Hampshire
                  </li>
                  <li class="list-inline-item">
                    <i class="bi bi-calendar2-plus me-1" /> Joined on Nov 26,
                    2019
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  );
}

export default Subida;
