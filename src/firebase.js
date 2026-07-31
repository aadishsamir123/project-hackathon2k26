// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChHhuG0vN_hRE0x_8SNRVkLSZHH-X-kBk",
  authDomain: "giis-hackathon-2026.firebaseapp.com",
  projectId: "giis-hackathon-2026",
  storageBucket: "giis-hackathon-2026.firebasestorage.app",
  messagingSenderId: "830549861495",
  appId: "1:830549861495:web:b7c0535b0509520dafd272"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
