// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvh3E5_JotVfLM5b07xC9wHjPOkxOJ6k8",
    authDomain: "edugateway.firebaseapp.com",
    databaseURL: "https://edugateway-default-rtdb.firebaseio.com",
    projectId: "edugateway",
    storageBucket: "edugateway.firebasestorage.app",
    messagingSenderId: "7861445720",
    appId: "1:7861445720:web:5ff7db6ce40fc74f18962d",
    measurementId: "G-LJ8BJX9DQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app); // Instancia de RTDB
export { db };