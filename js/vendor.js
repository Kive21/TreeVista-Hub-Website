import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
// import dotenv from 'dotenv';

// TreeVista Hub Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDztSMTwCkZ4ZMIELGb5sym_Ej5iX2yCTg",
    authDomain: "treevista-database-133b4.firebaseapp.com",
    projectId: "treevista-database-133b4",
    storageBucket: "treevista-database-133b4.appspot.com",
    messagingSenderId: "347600749387",
    appId: "1:347600749387:web:1a09815a85556382751ece",
    measurementId: "G-QFET2PTN20"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// dotenv.config();


// Initialize Firestore and Storage
const db = getFirestore();
const storage = getStorage();


// Initialize Firebase Analytics
const analytics = getAnalytics(app);
const storageRef = ref(storage);

function sweetAlertWithRedirect(message, type, redirectUrl) {
    Swal.fire({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      text: message,
      icon: type,
      confirmButtonText: 'OK'
    }).then(() => {
      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000); // 2000 milliseconds = 2 seconds
    });
  }

// Function to show error SweetAlert with cancel option
const sweetAlertWithError = (title, message, formElement) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonText: 'OK',
    showCancelButton: true,
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // If user confirms, redirect to the homepage
      window.location.href = '';
    } else {
      // If user cancels, reset the form
      formElement.reset();
    }
  });
};

