import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const storageRef = ref(storage, 'images/my-image.jpg');

getDownloadURL(storageRef).then((url) => {
  const image = new Image();
  image.src = url;
  image.onload = () => {
    console.log("Image loaded");
  };
});

const auth = getAuth(app);

// Google authentication provider
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
