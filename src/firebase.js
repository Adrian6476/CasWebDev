// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "REMOVED",
    authDomain: "REMOVED",
    projectId: "REMOVED",
    storageBucket: "REMOVED.appspot.com",
    messagingSenderId: "REMOVED",
    appId: "1:REMOVED:web:fac562e7e318273dbdaf83",
    measurementId: "REMOVED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };