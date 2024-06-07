// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/auth';
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDoDvF6AFG1DBtjRh-b4jeeMBwD9GfNXyo",
    authDomain: "kiran-projects-6099c.firebaseapp.com",
    projectId: "kiran-projects-6099c",
    storageBucket: "kiran-projects-6099c.appspot.com",
    messagingSenderId: "530791949462",
    appId: "1:530791949462:web:bf19c12cb2d0acc2a1ceb7",
    measurementId: "G-HHC61TQ07B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

 export { auth, RecaptchaVerifier, signInWithPhoneNumber, storage };

