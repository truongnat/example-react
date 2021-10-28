// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoHhbBfLmYm4y_yUmNC6t1QIilmmArOzs",
  authDomain: "exam-react-d1519.firebaseapp.com",
  projectId: "exam-react-d1519",
  storageBucket: "exam-react-d1519.appspot.com",
  messagingSenderId: "266304820411",
  appId: "1:266304820411:web:09923c20a31089ae7a859e",
  measurementId: "G-HCXT93XB6C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);