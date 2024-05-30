
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCe6MYZJogGWAQoyPbltCb82FN1dswSwsc",
  authDomain: "todo-f24ae.firebaseapp.com",
  projectId: "todo-f24ae",
  storageBucket: "todo-f24ae.appspot.com",
  messagingSenderId: "77038806724",
  appId: "1:77038806724:web:c3a66c5b95bcedac9f8b91",
  measurementId: "G-ZF8HF7L573"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db}