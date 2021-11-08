// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoHhbBfLmYm4y_yUmNC6t1QIilmmArOzs",
  authDomain: "exam-react-d1519.firebaseapp.com",
  projectId: "exam-react-d1519",
  storageBucket: "gs://exam-react-d1519.appspot.com",
  messagingSenderId: "266304820411",
  appId: "1:266304820411:web:09923c20a31089ae7a859e",
  measurementId: "G-HCXT93XB6C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

const storage = getStorage(app);

// Create a storage reference from our storage service
export const storageRef = ref(storage);
export const providerGoogle = new GoogleAuthProvider();
providerGoogle.setCustomParameters({ prompt: "select_account" });

export const signInGoogle = async (callback) => {
  await signInWithPopup(auth, providerGoogle)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log("check token : ", token);
      // The signed-in user info.
      const user = result.user;
      callback(user);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log("error : ", error);
    });
};
