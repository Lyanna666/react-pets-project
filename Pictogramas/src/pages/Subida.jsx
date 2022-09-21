import React from 'react';
import { useContext, useState, useEffect } from 'react';

import AppContext from '../AppContext';
import Spinner from '../components/loading/loading';
import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';
import firebase from 'firebase/compat/app';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import Animales from '../components/Filtros/Animales';

// import { createPath } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import FirestoreService from '../api/services/FirestoreService';

function Subida() {
  const context = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [imageAsUrl, setImageAsUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptcha, setRecaptcha] = useState(null);
  const [validate, setValidated] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [editando, setEditando] = useState(false);
  const [storageRef, setStorageRef] = useState(null);

  const handleInputChange = event => {
    const name = event.target.value;
  };

  // Sesion Firebase

  useEffect(() => {
    setIsLoading(true);
    firebase.auth().onAuthStateChanged(u => {
      if (u) {
        setUser(u);
        setImageAsUrl(u._delegate.photoURL);
        setIsLoading(false);
        console.log(u);
        fetchPublicaciones(u._delegate.uid);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(
    () => {
      setImageAsUrl(user ? user._delegate.photoURL : null);
    },
    [user],
  );

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
    const { email, pass2, pass1 } = e.target.elements;
    console.log(e.target.elements);

    if (pass2 !== pass1 && pass1.lenght > 5) {
      alert('Las contraseñas no coinciden o no cumplen los requisitos.');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email.value, pass1.value)
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
    }
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

  function fetchPublicaciones(idUsuario) {
    console.log('Cargando publicaciones del user ' + idUsuario);
    setIsLoading(true);
    FirestoreService.getPerrosById(idUsuario)
      .then(response => {
        setPublicaciones(response._delegate._snapshot.docChanges);
        console.log('Publicaciones:', response._delegate._snapshot.docChanges);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        alert('Error al cargar los perros: ' + e);
      });
  }

  function eliminarPerro(idPublicacion) {
    console.log('Eliminando publicacion ', idPublicacion);
    setIsLoading(true);
    FirestoreService.deletePerro(idPublicacion)
      .then(response => {
        // setPublicaciones(response._delegate._snapshot.docChanges);
        console.log('Respuesta: ELIMINAR PUBLICACIÓN ********\n', response);
        window.location.reload();
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        alert('Error al cargar los perros: ' + e);
      });
  }

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
        console.log(snapShot);
        setIsLoading(true);
      },
      err => {
        console.log(err);
        setIsLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(function(url) {
            console.log('URL de la nueva imagen', url);
            const imageURL = url;

            //  `imageURL` from async call
            var usuarioModificado = user;
            console.log('Usuario a modificar:', usuarioModificado);
            usuarioModificado
              .updateProfile({ photoURL: imageURL })
              .then(function() {
                console.log('Usuario modificado:', usuarioModificado);
                setUser(user);
                setImageAsUrl(imageURL);
                setIsLoading(false);
              })
              .catch(function(error) {
                console.log(error);
                setIsLoading(false);
              });
          })
          .catch(function(error) {
            console.log(error);
            setIsLoading(false);
          });
      },
    );
  };

  //Datos Usuarios
  const empezarAEditar = () => {
    if (!editando) {
      setEditando(true);
    }
  };

  const modificarUsuario = event => {
    event.preventDefault();
    setIsLoading(true);
    const { nombre, email, tlf } = event.target.elements;

    console.log(nombre.value, email.value, tlf.value);

    let usuarioActual = user;
    // usuarioActual.updateProfile()

    usuarioActual
      .updateEmail(email.value)
      .then(() => {
        usuarioActual
          .updateProfile({
            displayName: nombre.value,
          })
          .then(() => {
            if (tlf && tlf.length === 11) {
              updateProfilePhoneNumber(tlf.value);
            } else {
              setIsLoading(false);

              setEditando(false);
              window.refresh();
            }
          })
          .catch(error => {
            alert(
              'Ha ocurrido un error al intentar actualizar tu perfil: ',
              error,
            );
            setUser(firebase.auth().currentUser);

            setIsLoading(false);
          });
      })

      .catch(error => {
        console.log('Error actualizando email', error);
        setUser(firebase.auth().currentUser);
        setIsLoading(false);
      });

    return false;
  };

  function verificaremail(e) {
    e.preventDefault();
    setIsLoading(true);
    firebase.auth().currentUser.sendEmailVerification();
    setIsLoading(false);
    alert(
      'Se ha enviado un email al correo de verificación al email ',
      user._delegate.email,
      '. Si no lo encuentra mira en la carpeta de Span/No deaseado.',
    );
    return false;
  }

  async function updateProfilePhoneNumber(tlf, u) {
    var phoneNumber = '+34' + ' ' + tlf;
    console.log('Aqui entra?', phoneNumber);
    try {
      let verifier;
      if (!recaptcha) {
        verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          // callback: response => console.log('callback', response),
          size: 'invisible',
        });
      } else {
        verifier = recaptcha;
      }
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const id = await phoneProvider.verifyPhoneNumber(phoneNumber, verifier);
      const code = window.prompt(
        'Introduzca el código enviado al número de teléfono ' +
          phoneNumber +
          '.',
      );
      const cred = firebase.auth.PhoneAuthProvider.credential(id, code);
      await user.updatePhoneNumber(cred);
      console.log('phone number changed', id, cred, user);
      setIsLoading(false);
      setEditando(false);
      verifier.clear();
      setRecaptcha(verifier);
      // setSuccess(true);
    } catch (e) {
      console.error(e);
      alert(
        'Error al verificar el número de teléfono, prueba a recargar la página y volver a intentarlo:',
        e,
      );
      setIsLoading(false);
      setEditando(false);
    }
  }

  function cancelarEditando(e) {
    // e.preventDefault();
    setEditando(false);
    // return false;
  }

  const eliminarPublicacion = event => {
    console.log('Eliminando ', event.target.id);
    if (
      window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')
    ) {
      const idPublicacion = event.target.id;
      // eliminarPerro(idPublicacion);
      deleteFolder(idPublicacion + '/', idPublicacion);
    }

    function deleteFolder(path, idPerro) {
      setIsLoading(true);
      const ref = firebase.storage().ref(path);
      ref
        .listAll()
        .then(dir => {
          dir.items.forEach(fileRef => deleteFile(ref.fullPath, fileRef.name));
          dir.prefixes.forEach(folderRef => deleteFolder(folderRef.fullPath));
          setIsLoading(false);
          eliminarPerro(idPerro);
        })
        .catch(error => {
          console.log('Error eliminacion', error);
          setIsLoading(false);
        });
    }

    function deleteFile(pathToFile, fileName) {
      const ref = firebase.storage().ref(pathToFile);
      const childRef = ref.child(fileName);
      childRef.delete();
    }
  };

  return (
    <>
      <Header />
      <div class="main-bg" />
      {isLoading ? <Spinner allWindow={true} /> : <></>}
      <>
        {user === null ? (
          <>
            <div className="container-size mt-4 mb-4">
              <div class="row justify-content-center align-items-start m-4">
                <div class="col-12 col-md-6 col-lg-4 order-lg-1 order-2 card p-4">
                  {/* <img
                  src="https://media-public.canva.com/U7YhY/MAD9WpU7YhY/1/tl.png"
                  alt=""
                  class="img-fluid"
                /> */}
                  <div class="mb-lg-9 mb-2">
                    <h1 class="mb-1 h2 fw-normal">Login</h1>
                    <p class="fw-normal">
                      ¿Ya estás registrado? Inicia sesión en{' '}
                      <span class="fw-bold">ADOGTA</span> para publicar anuncios
                      y guardar en favoritos.
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
                    </div>
                  </form>
                  <div class="mt-4 mb-3 fw-bold">
                    También puedes iniciar sesión con tu teléfono móvil. {'  '}
                  </div>
                  <form>
                    <div class="col-12 input-group">
                      <input
                        type="text"
                        name="tlf"
                        class="form-control border-success"
                        placeholder="Teléfono móvil"
                        aria-describedby="button-tlf"
                      />
                      <button
                        class="btn btn-success"
                        type="button"
                        id="button-tlf"
                      >
                        Iniciar sesión
                      </button>
                    </div>
                  </form>
                </div>

                <div class="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1 card p-4">
                  <div class="mb-lg-9 mb-2">
                    <h1 class="mb-1 h2 fw-normal">Registro</h1>
                    <p class="fw-normal">
                      Regístrate en <span class="fw-bold">ADOGTA</span> para
                      publicar anuncios y guardar en favoritos.
                    </p>
                  </div>

                  <form onSubmit={registrarse}>
                    <div class="row g-3">
                      <div class="col-12">
                        <input
                          type="email-registro"
                          name="email"
                          class="form-control"
                          id="inputEmailRe"
                          placeholder="Email"
                          required=""
                        />
                      </div>
                      <div class="col-12">
                        <input
                          type="password"
                          class="form-control"
                          name="pass1"
                          id="inputPasswordRe"
                          placeholder="Contraseña"
                          required=""
                        />
                      </div>
                      <div class="col-12">
                        <input
                          type="password"
                          class="form-control"
                          name="pass2"
                          id="inputPasswordRe"
                          placeholder="Confirmar contraseña"
                          required=""
                        />
                      </div>
                      <div class="d-flex justify-content-between" />
                      <div class="col-12 d-grid">
                        {' '}
                        <button type="submit" class="btn btn-primary">
                          Registrarse
                        </button>
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
                          <div class="dropdown">
                            <button
                              class="btn btn-light btn-sm rounded-circle dropdown"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
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
                            <ul class="dropdown-menu ">
                              <li>
                                <button class="dropdown-item">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    class="bi bi-trash"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path
                                      fill-rule="evenodd"
                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                    />
                                  </svg>
                                  {'  '}
                                  Eliminar la imagen actual
                                </button>
                              </li>
                              <li>
                                <button class="dropdown-item">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    class="bi bi-plus-circle"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                  </svg>
                                  {'  '} Nueva imagen
                                </button>
                              </li>
                            </ul>
                          </div>
                        </span>

                        <div class="custom-btn-img usuario-img-div">
                          <span class="position-absolute top-0 end-0 badge rounded-pill">
                            <div class="dropdown">
                              <button
                                class="btn btn-light btn-sm rounded-circle dropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
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
                              <ul class="dropdown-menu ">
                                <li>
                                  <button class="dropdown-item">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      fill="currentColor"
                                      class="bi bi-trash"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                      <path
                                        fill-rule="evenodd"
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                      />
                                    </svg>
                                    {'  '}
                                    Eliminar la imagen actual
                                  </button>
                                </li>
                                <li>
                                  <label
                                    for="file-upload"
                                    class="custom-file-upload dropdown-item"
                                  >
                                    <div class="">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        class="bi bi-plus-circle"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                      </svg>{' '}
                                      {'  '} Nueva imagen
                                    </div>
                                  </label>
                                  <input
                                    id="file-upload"
                                    type="file"
                                    onInput={cambiarImagenPerfil}
                                  />
                                </li>
                              </ul>
                            </div>
                          </span>
                          <button
                            class="btn rounded-circle p-0 m-0"
                            data-bs-toggle="modal"
                            data-bs-target="#imagen-ampliada"
                          >
                            <img
                              class="avatar-img rounded-circle border border-white border-3 m-0 p-0 usuario-img"
                              src={
                                imageAsUrl
                                  ? imageAsUrl
                                  : 'https://cdn-icons-png.flaticon.com/512/3093/3093444.png'
                              }
                              alt=""
                            />
                          </button>
                          <div class="modal" tabindex="-1" id="imagen-ampliada">
                            <div class="modal-dialog">
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
                                      imageAsUrl
                                        ? imageAsUrl
                                        : 'https://cdn-icons-png.flaticon.com/512/3093/3093444.png'
                                    }
                                    alt=""
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ms-sm-4 mt-sm-3">
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
                    </div>
                    <div id="recaptcha-container" />
                    <div class="d-flex mt-3 justify-content-center ms-sm-auto">
                      <button
                        class="btn btn-danger-soft me-2"
                        type="button"
                        onClick={empezarAEditar}
                      >
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
                      <Link
                        class="btn btn-success-soft me-2"
                        to={'/nuevapublicacion'}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-upload"
                          viewBox="0 0 16 16"
                        >
                          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                        </svg>{' '}
                        Publicar anuncio
                      </Link>
                      <div class="dropdown">
                        <button
                          class="icon-md btn btn-light"
                          type="button"
                          id="profileAction2"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-three-dots"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                          </svg>
                        </button>

                        <ul
                          class="dropdown-menu dropdown-menu-end"
                          aria-labelledby="profileAction2"
                        >
                          <li>
                            <a class="dropdown-item" href="#">
                              Compartir perfil
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="#">
                              Eliminar perfil
                            </a>
                          </li>

                          <li>
                            <hr class="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              onClick={cerrarSesion}
                              class="dropdown-item fw-bold"
                            >
                              Cerrar sesión
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex flex-column mb-3 m-4 p-3 card">
                    <h5 class="ml-4 mb-1 h4 pl-4 fw-bold">
                      {'  '}Datos personales
                    </h5>
                    <div class=" p-4 justify-content-center text-center">
                      <form onSubmit={modificarUsuario}>
                        <table class="table">
                          <thead>
                            <tr>
                              <th scope="col">
                                <label for="emailUser">
                                  <span class="">
                                    {user._delegate.emailVerified ? (
                                      <>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          fill="currentColor"
                                          class="bi bi-patch-check-fill color-success"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                                        </svg>{' '}
                                        Email verificado
                                        {'  '}
                                      </>
                                    ) : (
                                      <>Email</>
                                    )}
                                  </span>{' '}
                                </label>
                              </th>
                              <td>
                                <input
                                  type="email"
                                  name="email"
                                  placeholder="Email"
                                  class="form-control"
                                  id="emailUser"
                                  defaultValue={
                                    user._delegate.email
                                      ? user._delegate.email
                                      : ''
                                  }
                                  disabled={!editando}
                                  required
                                />
                              </td>
                              {!user._delegate.emailVerified ? (
                                <>
                                  {' '}
                                  <td>
                                    <button
                                      class="btn btn-primary"
                                      type="button"
                                      onClick={verificaremail}
                                    >
                                      Verificar email
                                    </button>
                                  </td>
                                </>
                              ) : (
                                <></>
                              )}
                            </tr>

                            <tr>
                              <th>
                                <label for="nombreUser">Nombre</label>
                              </th>
                              <td>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="nombreUser"
                                  name="nombre"
                                  placeholder="Nombre"
                                  defaultValue={
                                    user._delegate.displayName
                                      ? user._delegate.displayName
                                      : ''
                                  }
                                  disabled={!editando}
                                />
                                <div class="invalid-feedback">
                                  Introduce un email válido
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <label for="tlfUser">Número de teléfono</label>
                              </th>
                              <td>
                                <input
                                  type="tel"
                                  name="tlf"
                                  class="form-control"
                                  id="tlfUser"
                                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                                  defaultValue={
                                    user._delegate.phoneNumber
                                      ? user._delegate.phoneNumber
                                      : ''
                                  }
                                  placeholder="Formato válido: 651-706-161"
                                  disabled={!editando}
                                />
                              </td>
                            </tr>
                          </thead>
                        </table>

                        {editando ? (
                          <>
                            <button type="submit" className="btn btn-success">
                              Guardar cambios
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger m-2"
                              onClick={cancelarEditando}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                      </form>
                    </div>
                  </div>
                  <div class="d-flex flex-column mb-3 m-4 p-3 card">
                    <h5 class="ml-4 mb-1 h4 pl-4 fw-bold">Publicaciones</h5>
                    <Animales
                      mascotas={publicaciones}
                      perfil={true}
                      eliminarPublicacion={eliminarPublicacion}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
      <div className="main-bg" />
      <Footer />
    </>
  );
}

export default Subida;
