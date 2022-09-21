import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';

import React from 'react';
import { useContext, useState, useEffect } from 'react';

import AppContext from '../AppContext';
import Spinner from '../components/loading/loading';
import firebase from 'firebase/compat/app';

import FirestoreService from '../api/services/FirestoreService';

const Informacion = () => {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

  return (
    <>
      <Header />
      {isLoading ? <Spinner allWindow={true} /> : <></>}
      <div class="main-bg" />
      <main class="page-wrapper">
        <section
          class="text-bg-dark position-relative pt-5"
          style={{ backgroundColor: '#212529' }}
        >
          <div class=" w-100 position-relative zindex-2 pt-5 pb-2 pb-md-0">
            <div class="row justify-content-center pt-3 mt-3">
              <div class="col-xl-6 col-lg-7 col-md-8 col-sm-10 text-center">
                <h1 class="mb-4">¿Quieres apoyar el proyecto?</h1>
                <p class="fs-lg pb-3 mb-3">
                  Síguenos en redes sociales para apoyanos. ¿Quieres colaborar?
                  ¡Ponte en contacto con nosotros!
                </p>
                <div class="d-flex justify-content-center">
                  <a
                    href="#"
                    class="btn btn-icon btn-secondary btn-facebook rounded-circle mx-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-facebook"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="btn btn-icon btn-secondary btn-instagram rounded-circle mx-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-instagram"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="btn btn-icon btn-secondary btn-google rounded-circle mx-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-twitter"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="btn btn-icon btn-secondary btn-twitter rounded-circle mx-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-linkedin"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            class="d-flex position-absolute  top-100 start-0 w-100 overflow-hidden mt-n5"
            style={{ color: '##000000' }}
          >
            <div
              class="position-relative start-50  translate-middle-x flex-shrink-0 mt-n5 mt-md-n3 mt-lg-n1"
              style={{ width: '3788px' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="3788"
                height="144"
                viewBox="0 0 3788 144"
              >
                <path
                  fill="#212529"
                  d="M0,0h3788.7c-525,90.2-1181.7,143.9-1894.3,143.9S525,90.2,0,0z"
                />
              </svg>
            </div>
          </div>
        </section>

        <section class=" py-5 my-md-2 my-lg-4 my-xl-5">
          <div class="row justify-content-center pt-5 pb-1 pb-sm-2 pb-md-3">
            <div class="col-xxl-8 col-xl-9 col-lg-10 pt-sm-2 pt-md-5">
              <div class="d-sm-flex">
                <div class="d-flex flex-column w-sm-50 border-0 bg-transparent text-center px-sm-1 px-md-5 pb-3 pb-sm-0 mb-4 mb-sm-0">
                  <div class="card-body p-0">
                    <div class="d-inline-block bg-light text-primary rounded-circle fs-3 lh-1 p-3 mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-envelope"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                      </svg>
                    </div>
                    <p class="pb-2 pb-sm-3 mb-3">
                      Por favor, contacta con nosotros si lo necesitas.
                      Contestaremos lo antes posible.
                    </p>
                  </div>
                  <div class="card border-0 p-0">
                    <a
                      href="mailto:ggarciaandrea@gmail.com"
                      class="btn btn-lg btn-primary"
                    >
                      Enviar email
                    </a>
                  </div>
                </div>
                <div class="vr text-border d-none d-sm-inline-block m-4" />
                <div class="card w-sm-50 border-0 bg-transparent text-center px-sm-1 px-md-5">
                  <div class="card-body p-0">
                    <div class="d-inline-block bg-light text-primary rounded-circle fs-3 lh-1 p-3 mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-telephone"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                      </svg>
                    </div>
                    <p class="pb-2 pb-sm-3 mb-3">
                      Por favor, contacta con nosotros si lo necesitas.
                      Contestaremos lo antes posible.
                    </p>
                  </div>
                  <div class="card border-0 p-0">
                    <a href="tel:691269222" class="btn btn-lg btn-primary">
                      Llamar por teléfono
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="container-size">
          <div class="bg-light rounded-3 py-5 px-3 px-sm-4 px-md-0">
            <h2 class="text-center pt-md-1 pt-lg-3 pt-xl-4 pb-4 mt-xl-1 mb-2">
              Preguntas frecuentes
            </h2>
            <div class="row justify-content-center pb-lg-4 pb-xl-5">
              <div class="col-xl-8 col-lg-9 col-md-10 pb-md-2">
                <div class="accordion" id="faq">
                  <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                    <h3 class="accordion-header">
                      <button
                        class="accordion-button shadow-none rounded-3"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#q-1"
                        aria-expanded="true"
                        aria-controls="q-1"
                      >
                        ¿Qué requisitos son necesarios para adoptar?
                      </button>
                    </h3>
                    <div
                      class="accordion-collapse collapse show"
                      id="q-1"
                      data-bs-parent="#faq"
                    >
                      <div class="accordion-body fs-sm pt-0 m-4">
                        <p>
                          El proceso de adopción es un acto, a través del cual,
                          una persona mayor de edad se hace cargo de un animal
                          de la protectora con la finalidad de darle un hogar y
                          cuidarlo.
                        </p>
                        <p>
                          Para adoptar es necesario Ser mayor de edad, tener un
                          domicilio en el que poder tener el animal adoptado,
                          firmar un contrato de adopción y asumir los costes
                          veterinarios.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                    <h3 class="accordion-header">
                      <button
                        class="accordion-button shadow-none rounded-3 collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#q-2"
                        aria-expanded="false"
                        aria-controls="q-2"
                      >
                        ¿Qué es un contrato de adopción?
                      </button>
                    </h3>
                    <div
                      class="accordion-collapse collapse"
                      id="q-2"
                      data-bs-parent="#faq"
                    >
                      <div class="accordion-body fs-sm pt-0 m-4">
                        <p>
                          Es un documento en el que básicamente te comprometes a
                          ser un buen dueño, cuidando del animal en unas
                          condiciones óptimas de espacio, tiempo, alimentación,
                          ejercicio,... y proporcionándole los cuidados
                          veterinarios que requiera.
                        </p>
                        <p />
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                    <h3 class="accordion-header">
                      <button
                        class="accordion-button shadow-none rounded-3 collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#q-3"
                        aria-expanded="false"
                        aria-controls="q-3"
                      >
                        ¿Hay que esterilizar al animal adoptado?
                      </button>
                    </h3>
                    <div
                      class="accordion-collapse collapse"
                      id="q-3"
                      data-bs-parent="#faq"
                    >
                      <div class="accordion-body fs-sm pt-0 m-4">
                        <p>
                          Si, esto se hace en favor de la salud del ánimal, así
                          como para evitar el exceso de ánimales en situaciones
                          precarias. En algunos casos, por motivos de edad o
                          salud, la esterilización no ha sido realizada, por
                          tanto el adoptante deberá hacerse caso de dicha
                          esterilización.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                    <h3 class="accordion-header">
                      <button
                        class="accordion-button shadow-none rounded-3 collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#q-4"
                        aria-expanded="false"
                        aria-controls="q-4"
                      >
                        Ya he completado el formulario de adopción, ¿y ahora
                        que?
                      </button>
                    </h3>
                    <div
                      class="accordion-collapse collapse"
                      id="q-4"
                      data-bs-parent="#faq"
                    >
                      <div class="accordion-body fs-sm pt-0 m-4">
                        <p>
                          Las respuestas no son inmediatas, ten en cuenta que
                          hay mucho trabajo por hacer y somos pocas personas. Si
                          ha pasado un tiempo razonable y no tienes un correo de
                          respuesta, consulta tu correo electrónico en la
                          bandeja de correo no deseado, si tienes activado el
                          antispam es posible que nuestro correo de respuesta
                          haya sido enviado a dicha bandeja. Si aún así no
                          encuentras la respuesta contacta con nosotros.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                    <h3 class="accordion-header">
                      <button
                        class="accordion-button shadow-none rounded-3 collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#q-5"
                        aria-expanded="false"
                        aria-controls="q-5"
                      >
                        ¿Hay que tener algo preparado en el momento de la
                        adopción?
                      </button>
                    </h3>
                    <div
                      class="accordion-collapse collapse"
                      id="q-5"
                      data-bs-parent="#faq"
                    >
                      <div class="accordion-body fs-sm pt-0 m4">
                        <p>
                          Sí, se recomienda traer los accesorios adecuados para
                          el transporte del animal (transportín, correa y
                          collar, etc).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Informacion;
