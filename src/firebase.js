
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCGaD0gjGAU0Vm-OvvnpS4rWuynkn4XwBw",
    authDomain: "chatting-app-33a41.firebaseapp.com",
    projectId: "chatting-app-33a41",
    storageBucket: "chatting-app-33a41.appspot.com",
    messagingSenderId: "961478541372",
    appId: "1:961478541372:web:872cec3b68a93dea734339"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
