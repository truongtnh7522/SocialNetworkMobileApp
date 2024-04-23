import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB1Ts_BGQRpwXUh8yeIpUFqoDeq7-6Bir4",
  authDomain: "chaapprj.firebaseapp.com",
  projectId: "chaapprj",
  storageBucket: "chaapprj.appspot.com",
  messagingSenderId: "339597109735",
  appId: "1:339597109735:web:02b74cb551515e2d3ef542",
  measurementId: "G-LX4VXQ7VL0"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
