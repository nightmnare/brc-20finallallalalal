import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD96pGvatbUYw_djFVaov15zSlf2QSkaco",
  authDomain: "bitradio-4126b.firebaseapp.com",
  databaseURL: "https://bitradio-4126b-default-rtdb.firebaseio.com",
  projectId: "bitradio-4126b",
  storageBucket: "bitradio-4126b.appspot.com",
  messagingSenderId: "701922522228",
  appId: "1:701922522228:web:58af1e112eb3c0764b0d21",
  measurementId: "G-VX0ZDB5ML0",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storedb = getFirestore(app);
