import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDhfPiqEsrvD82ZLNibWH261Epz3ZJJo2w',
  authDomain: 'adogta-2219f.firebaseapp.com',
  projectId: 'adogta-2219f',
  storageBucket: 'adogta-2219f.appspot.com',
  messagingSenderId: '947993543026',
  appId: '1:947993543026:web:d40b20448b071a78a55deb',
};

// Inicializar Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export { db };
