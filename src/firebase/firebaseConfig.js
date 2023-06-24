import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaoAVp1odQ3l4EHojkSbz-2lD-gbSMi1U",
  authDomain: "flavory-beta.firebaseapp.com",
  databaseURL: "https://flavory-beta-default-rtdb.firebaseio.com",
  projectId: "flavory-beta",
  storageBucket: "flavory-beta.appspot.com",
  messagingSenderId: "313891481904",
  appId: "1:313891481904:web:e47e7185c790b57d8b40f5",
  measurementId: "G-6B2RD69QWQ"
};
// Initialize Firebase


// Check if Firebase app is already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Sign in to Firebase


export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const auth = getAuth();

// Google authentication provider
export const googleProvider = new GoogleAuthProvider();

export default firebase;