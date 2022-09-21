import React from 'react';
import { useContext, useState } from 'react';

import AppContext from '../AppContext';
import Filtros from '../components/Filtros/Filtros';
import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';

function Gallery() {
  const context = useContext(AppContext);
  const [inputText, setInputText] = useState('');
  const [savedData, setSavedData] = React.useState(false);
  let favoritos = {};

  const handleInputChange = event => {
    const name = event.target.value;
    setInputText(name);

    favoritos[name] = name;
    console.log(name, favoritos);
  };

  const saveData = () => {
    localStorage['favoritos'] = JSON.stringify({ 'nombre:': 'Andrea' });
    localStorage.setItem('nombre', JSON.stringify(favoritos));
    alert('Datos guardados');
    setSavedData(true);
  };

  return (
    <>
      <div className="main-bg" />
      <div
        className="d-flex flex-column justify-content-between"
        style={{ minHeight: '100vh' }}
      >
        <Header />
        <Filtros />
        <Footer />
      </div>
    </>
  );
}

export default Gallery;
