import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCe6MYZJogGWAQoyPbltCb82FN1dswSwsc",
  authDomain: "todo-f24ae.firebaseapp.com",
  projectId: "todo-f24ae",
  storageBucket: "todo-f24ae.appspot.com",
  messagingSenderId: "77038806724",
  appId: "1:77038806724:web:cf14b76af5feebec9f8b91",
  measurementId: "G-D0GH0CFLLC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
