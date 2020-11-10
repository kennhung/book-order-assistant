import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBjSFT1hvZxs9Y_xKd3vw1EnyDiaRc4BS8",
    authDomain: "book-order-assistant.firebaseapp.com",
    databaseURL: "https://book-order-assistant.firebaseio.com",
    projectId: "book-order-assistant",
    storageBucket: "book-order-assistant.appspot.com",
    messagingSenderId: "541659893773",
    appId: "1:541659893773:web:46e34c569a984e6fcf8544"
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const auth = firebase.auth();

export default firebase