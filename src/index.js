import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { FirebaseContext } from './store/FirebaseContext';
import firebase from './firebase/firebaseConfig';
import Context from './store/FirebaseContext'
ReactDOM.render(
  
  <FirebaseContext.Provider value={{firebase}}>
    <Context >
    <App />
    </Context>
  </FirebaseContext.Provider>

,document.getElementById('root'));
