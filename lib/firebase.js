// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfigString = `{
  "apiKey": "AIzaSyD98XX0OWfeyPmzXxMhOpqHmP8zwR-gZlg",
  "authDomain": "hangar1-erp.firebaseapp.com",
  "projectId": "hangar1-erp",
  "storageBucket": "hangar1-erp.appspot.com",
  "messagingSenderId": "326894472204",
  "appId": "1:326894472204:web:978380ad646e5fdaa3b229"
}`;
const firebaseConfig = JSON.parse(firebaseConfigString);

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Inicializa Auth
const auth = getAuth(app);

// Inicializa Storage
const storage = getStorage(app);

export { auth, signInWithEmailAndPassword, db, storage };
