// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import {AUTHDOMAIN} from '@env'
// import {PROJECTID} from '@env'
// import {STORAGEBUCKET} from '@env'
// import {MSID} from '@env'
// import {APPID} from '@env'


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDUsx-ktIbX0ji7NbsvJCN1QAtVlKPmpSo',
    authDomain: 'fling-app-9fbec.firebaseapp.com',
    projectId: 'fling-app-9fbec',
    storageBucket: 'fling-app-9fbec.appspot.com',
    messagingSenderId: '42117056697',
    appId: '1:42117056697:web:37167155690e45779cb368'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };