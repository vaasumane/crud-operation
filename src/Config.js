import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAKtbOzE-6FPhlSztSqpvAt9hfM1Y9q7Es",
    authDomain: "crud-project-24a25.firebaseapp.com",
    projectId: "crud-project-24a25",
    storageBucket: "crud-project-24a25.appspot.com",
    messagingSenderId: "929108480761",
    appId: "1:929108480761:web:fdc8482b4eec36b4228828",
    measurementId: "G-SS5CJF7ZBK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// You can initialize other Firebase services as needed (e.g., auth, firestore)
const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };
export default firebase;
