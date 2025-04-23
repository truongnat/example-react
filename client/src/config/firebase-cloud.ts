// // Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage } from 'firebase/storage';

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth();

export const storage = getStorage(app);

// export const providerGoogle = new GoogleAuthProvider();
// providerGoogle.setCustomParameters({ prompt: "select_account" });

// export const signInGoogle = async (callback) => {
//   await signInWithPopup(auth, providerGoogle)
//     .then((result) => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;
//       console.log("check token : ", token);
//       // The signed-in user info.
//       const user = result.user;
//       callback(user);
//       // ...
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       // The email of the user's account used.
//       // The AuthCredential type that was used.
//       // const credential = GoogleAuthProvider.credentialFromError(error);
//       // ...
//       console.log("error : ", error);
//     });
// };
