import { db } from '../firestore';
import firebase from 'firebase/compat/app';

// Razas de perros
function getRazas() {
  return new Promise((resolve, reject) => {
    db.collection('razas')
      .orderBy('nombre')
      .get()
      .then(razas => {
        resolve(razas);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// Perros
function getPerros() {
  return new Promise((resolve, reject) => {
    db.collection('perros')
      .orderBy('nombre')
      .get()
      .then(perros => {
        resolve(perros);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function getPerrosOrder(orderId) {
  return new Promise((resolve, reject) => {
    db.collection('perros')
      .orderBy(orderId)
      .get()
      .then(perros => {
        resolve(perros);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function getPerrosById(usuarioId) {
  return new Promise((resolve, reject) => {
    db.collection('perros')
      .where('user', '==', usuarioId)
      .get()
      .then(perros => {
        resolve(perros);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function addPerro(perro) {
  return new Promise((resolve, reject) => {
    const data = {
      nombre: perro.nombre,
      fechaNac: perro.fechaNac,
      Sexo: perro.sexo,
      Tamaño: perro.tamaño,
      img: perro.img,
      localizacion: perro.localizacion,
      raza: perro.raza,
      descripcion: perro.descripcion,
      ne: perro.ne,
      urgente: perro.urgente,
      user: perro.user,
      tlf: perro.tlf,
      email: perro.email,
    };
    db.collection('perros')
      .add(data)
      .then(docRef => {
        resolve(docRef);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function deletePerro(perroId) {
  return new Promise((resolve, reject) => {
    db.collection('perros')
      .doc(perroId)
      .delete()
      .then(() => {
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });
}

function getPerro(perroId) {
  return new Promise((resolve, reject) => {
    db.collection('perros')
      .doc(perroId)
      .get()
      .then(perro => {
        resolve(perro);
      })
      .catch(e => {
        reject(e);
      });
  });
}
//Imagenes

function updateFotosPerros(fotoURL, idPerro) {
  return new Promise((resolve, reject) => {
    const data = { img: firebase.firestore.FieldValue.arrayUnion(fotoURL) };

    db.collection('perros')
      .doc(idPerro)
      .update(data)
      .then(() => {
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });
}

// Clases *****************
function getSubclases() {
  return new Promise((resolve, reject) => {
    db.collection('razas')
      .orderBy('nombre')
      .get()
      .then(razas => {
        resolve(razas);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function getAllMenuCategories() {
  return new Promise((resolve, reject) => {
    db.collection('clases')
      .get()
      .then(allMenuCategories => {
        resolve(allMenuCategories);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function AddNewMenuItem(itemName, itemCategory, itemPrice) {
  return new Promise((resolve, reject) => {
    const data = {
      itemName: itemName,
      itemCategory: itemCategory,
      itemPrice: parseFloat(itemPrice),
    };

    db.collection('MenuItems')
      .add(data)
      .then(docRef => {
        resolve(docRef);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function UpateMenuItem(menuItemID, itemName, itemCategory, itemPrice) {
  return new Promise((resolve, reject) => {
    const data = {
      itemName: itemName,
      itemCategory: itemCategory,
      itemPrice: parseFloat(itemPrice),
    };

    db.collection('clases')
      .doc(menuItemID)
      .update(data)
      .then(() => {
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });
}

function DeleteMenuItem(menuItemID) {
  return new Promise((resolve, reject) => {
    db.collection('MenuItems')
      .doc(menuItemID)
      .delete()
      .then(() => {
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });
}

// Personajes *****************
function getPersonajes(usuario) {
  return new Promise((resolve, reject) => {
    //console.log(usuario);
    db.collection('personajes')
      .orderBy('nombre')
      .where('usuario', '==', usuario)
      .get()
      .then(personajes => {
        resolve(personajes);
        //console.log('Respuesta user:', personajes);
      })
      .catch(e => {
        reject(e);
        //console.log('Respuesta user:', e);
      });
  });

  // return new Promise((resolve, reject) => {
  //   db.collection('personajes')
  //     .get()
  //     .then(personajes => {
  //       const tempDoc = [];
  //       personajes.docs.map(doc => {
  //         tempDoc.push({ id: doc.id, ...doc.data() });
  //       });
  //       console.log('Promise db:', tempDoc, '-', personajes);
  //       resolve(tempDoc);
  //     })
  //     .catch(e => {
  //       reject(e);
  //     });
  // });

  // const events = await firebase.firestore().collection('personajes');
  // events.get().then(querySnapshot => {
  //   const tempDoc = [];
  //   querySnapshot.forEach(doc => {
  //     tempDoc.push({ id: doc.id, ...doc.data() });
  //   });
  //   console.log('base de dato:', tempDoc);
  // });
}

function addPersonaje(nombre, clase, icono, usuario) {
  return new Promise((resolve, reject) => {
    const data = {
      nombre: nombre,
      clase: clase,
      icono: icono,
      usuario: usuario,
    };
    //console.log(data);
    db.collection('personajes')
      .add(data)
      .then(docRef => {
        resolve(docRef);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function deletePersonaje(personajeId) {
  return new Promise((resolve, reject) => {
    db.collection('personajes')
      .doc(personajeId)
      .delete()
      .then(() => {
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });
}

function getPersonaje(id) {
  return new Promise((resolve, reject) => {
    //console.log(id);
    db.collection('personajes')
      .doc(id)
      .get()
      .then(querySnapshot => {
        resolve(querySnapshot);
      })
      .catch(e => {
        reject(e);
        //console.log('Respuesta personaje por id:', e);
      });
  });
}

function getTodosPersonajes() {
  return new Promise((resolve, reject) => {
    //console.log(id);
    db.collection('personajes')
      .get()
      .then(querySnapshot => {
        resolve(querySnapshot);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// Calendarios *****************
function getCalendarios() {
  return new Promise((resolve, reject) => {
    db.collection('calendarios')
      .get()
      .then(calendarios => {
        resolve(calendarios);
        //console.log('Respuesta calendarios:', calendarios);
      })
      .catch(e => {
        reject(e);
        //console.log('Error calendarios:', e);
      });
  });
}

// Eventos *****************
function addEvento(dia, hora, personajes, idCalendario) {
  return new Promise((resolve, reject) => {
    const data = {
      dia: dia,
      hora: hora,
      personajes: personajes,
    };
    db.collection('calendario')
      .doc(idCalendario)
      .add(data)
      .then(docRef => {
        resolve(docRef);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function getEventoPorDia(idCalendario, dia, hora) {
  return new Promise((resolve, reject) => {
    //console.log(id);
    db.collection('calendarios')
      .doc(idCalendario)
      .collection('evento')
      .where('dia', '==', dia)
      .where('hora', '==', hora)
      .get()
      .then(querySnapshot => {
        resolve(querySnapshot);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export default {
  getSubclases,
  getAllMenuCategories,
  AddNewMenuItem,
  UpateMenuItem,
  DeleteMenuItem,
  getPersonajes,
  addPersonaje,
  deletePersonaje,
  getCalendarios,
  getPersonaje,
  getTodosPersonajes,
  addEvento,
  getEventoPorDia,

  getRazas,
  getPerros,
  addPerro,
  updateFotosPerros,
  getPerrosById,
  deletePerro,
  getPerro,
  getPerrosOrder,
};
