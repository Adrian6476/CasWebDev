// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyChS6vN_Lk3K_9zj2hklIyhkmgD2a66HAk",
    authDomain: "reusable-portal.firebaseapp.com",
    projectId: "reusable-portal",
    storageBucket: "reusable-portal.appspot.com",
    messagingSenderId: "1043075733434",
    appId: "1:1043075733434:web:fac562e7e318273dbdaf83",
    measurementId: "G-D8WSN0J6J4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };