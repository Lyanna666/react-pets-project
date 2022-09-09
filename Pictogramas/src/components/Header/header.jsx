import './header.css';

import { useContext, React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AppContext from '../../AppContext';
import HeaderMenu from '../HeaderMenu/header-menu';

const Header = () => {
  const context = useContext(AppContext);

  // Estado para saber si el usuario ha iniciado sesion
  const [user, setUser] = useState(null);
  // Creo un estado para saber si se está mostrando el menú o no.
  // En el evento onClick cambio ese estado a true o false en función de si se muestra el menú
  const [openedMenu, setOpenedMenu] = useState(false);

  // Se añade un evento que se ejecuta cuando el tamaño de la pantalla cambia
  window.addEventListener('resize', checkForWindowResize);

  function checkForWindowResize() {
    //Si el tamaño del navegador es menos de 1024 escondo el menu para que no quede abierto al hacer resize
    if (window.innerWidth > 1024) {
      setOpenedMenu(false);
    }
  }

  const updateUser = () => {
    // Si hay algo en local storage de user, actualizamos user
    if (localStorage.getItem('user')) {
      setUser(localStorage.getItem('user'));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // window.localStorage.clear(); -> Esto elimina todo lo que haya en local storage
    updateUser();
    function storageEventHandler(event) {
      // Entra en esta función cuando el usuario ha cambiado
      if (event.key === 'user') {
        updateUser();
      }
    }

    // Añadimos el evento storageEventHandler, este evento se ejecuta cuando cambie el localstorage
    window.addEventListener('storage', storageEventHandler);
    return () => {
      window.removeEventListener('storage', storageEventHandler);
    };
  }, []);

  // Función que abre y cierra el menu
  const onClickMenu = event => {
    setOpenedMenu(!openedMenu);
  };

  return (
    <>
      <header id="header">
        {/* Idiomas */}
        <div class="bg-light py-1">
          <div class="container-size">
            <div class="dropdown">
              <button
                class="dropdown-toggle text-decoration-none text-muted show"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {context.language.HEADER_LANGUAGE}
              </button>
              <ul class="dropdown-menu">
                <li>
                  <button
                    id={context.language.ES_ID}
                    class="dropdown-item"
                    type="button"
                    onClick={context.changeLanguage}
                  >
                    {context.language.ES}
                  </button>
                </li>
                <li>
                  <button
                    id={context.language.EN_ID}
                    type="button"
                    class="dropdown-item"
                    onClick={context.changeLanguage}
                  >
                    {context.language.EN}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="container-size main-header">
          {/* Logo */}
          <Link className="link link-login" to={'/'}>
            <h1>
              AD
              <span>
                <picture>
                  <img src="./Resources/pets_FILL0_wght400_GRAD0opsz48.png" />
                </picture>
              </span>
              GTA
            </h1>
          </Link>
          <nav>
            {/* <picture>
            <img
              src="./Resources/Logo-PERRO.png"
              alt={context.language.NAME_APP}
            />
          </picture> */}
            {/* NavBar */}

            <div class="container-fluid">
              <form class="container-fluid">
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    class="form-control "
                    placeholder="Buscar"
                    aria-label="Buscar"
                    aria-describedby="basic-addon1"
                  />
                  <Link
                    class="btn  btn-outline-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#locationModal"
                    to={'/subida'}
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
                    Location
                  </Link>
                  <Link className="link link-login" to={'/subida'}>
                    Link{' '}
                  </Link>
                </div>
              </form>
            </div>

            <div class="header-login">
              {/* Si el usuario no ha iniciado sesion  muestro un link que permite navegar al registro/login*/}
              {!user ? (
                <>
                  <Link className="link link-login" to={'/'}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-heart"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </Link>
                  <Link className="link link-login" to={'/login'}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-user"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Link>
                </>
              ) : (
                <Link
                  className="link link-login"
                  to={
                    '/dashboard' // Si ya ha inciado sesión muestro un link que navega a dashboard
                  }
                >
                  {`${context.language.DASHBOARD} \n${user}`}
                </Link>
              )}
            </div>
          </nav>
        </div>
        <div>
          <div class="container-size container-navbar-nav">
            <nav class="navbar-subnav">
              <ul class="navbar-nav">
                <li class="nav-item dropdown dropdown-fullwidth">
                  <a
                    class="btn btn-primary px-6"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Animales en adopción
                  </a>
                  <div class="dropdown-menu pb-0">
                    <div class="row p-2 p-lg-4">
                      <div class="col-lg-3 col-6 mb-4 mb-lg-0">
                        <h6 class="text-primary ps-3">
                          <span class="icons-menu-span">
                            <i class="fa-solid fa-dog" />
                          </span>
                          Perros
                        </h6>
                        <a
                          class="dropdown-item important-link"
                          href="../pages/shop-grid.html"
                        >
                          Casos urgentes
                        </a>
                        <a
                          class="dropdown-item important-link"
                          href="../pages/shop-grid.html"
                        >
                          Perros con necesidades especiales
                        </a>
                        <hr class="dropdown-divider" />
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Cachorros en adopción
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Acogida temporal
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Perros de servicio jubilados
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Todos los perros en adopción
                        </a>
                      </div>
                      <div class="col-lg-3 col-6 mb-4 mb-lg-0">
                        <h6 class="text-primary ps-3">
                          {' '}
                          <span class="icons-menu-span">
                            <i class="fa-solid fa-cat" />
                          </span>
                          Gatos
                        </h6>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Casos urgentes
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          {' '}
                          Gatos con necesidades especiales
                        </a>
                        <hr class="dropdown-divider" />
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Acogida temporal
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          {' '}
                          Todos los gatos disponibles
                        </a>
                      </div>
                      <div class="col-lg-3 col-12 mb-4 mb-lg-0">
                        <h6 class="text-primary ps-3">
                          <span class="icons-menu-span">
                            <i class="fa-solid fa-fish" />
                          </span>
                          Otros
                        </h6>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Casos urgentes
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Animales con necesidades especiales
                        </a>
                        <hr class="dropdown-divider" />
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Aves
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Roedores y pequeños mamíferos
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Reptiles y anfibios
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Animales de granja
                        </a>
                        <a class="dropdown-item" href="../pages/shop-grid.html">
                          Animales exóticos
                        </a>
                      </div>
                      <div class="col-lg-3 col-12 mb-4 mb-lg-0 ">
                        <div class="card border-0">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7uxCfZU_gGJX_Bxxt_eBYtBypnRO2ViAhS83nnvTYRewu3N-0Sett8dmcc-a68LuFjyA&usqp=CAU"
                            alt="Imagen refugio de animales"
                            class="img-fluid rounded-3"
                          />
                          <div class="position-absolute ps-6 mt-8 div-donate">
                            <h5 class=" mb-0 ">
                              ¿Quieres ayudar? <br />
                              ¡Haz una donación!
                            </h5>
                            <a href="#" class="btn btn-primary btn-sm mt-3">
                              Donar
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <ul class="navbar-nav">
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Información
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="#">
                        Preguntas frecuentes
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">
                        Sobre nosotros
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">
                        Contacto
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul class="navbar-nav">
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Protectoras de animales
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="#">
                        Información importante
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">
                        Ver protectoras
                      </a>
                    </li>
                    <hr class="dropdown-divider" />
                    <li>
                      <a class="dropdown-item" href="#">
                        Registro para protectoras
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <button onClick={onClickMenu} className="btn-menu">
          ☰
        </button>
      </header>

      {/* Si el estado del menú es true lo muestro, si no, no */}
      {openedMenu ? <HeaderMenu /> : <></>}
    </>
  );
};

export default Header;
