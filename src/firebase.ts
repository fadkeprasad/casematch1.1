// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3FtwucA7A288m96rqhgUpHn2rOOmxw1A",
  authDomain: "casematch-c55af.firebaseapp.com",
  projectId: "casematch-c55af",
  storageBucket: "casematch-c55af.appspot.com",
  messagingSenderId: "1089353580394",
  appId: "1:1089353580394:web:416b7bd79bdf6b9cbeef13",
  measurementId: "G-XW74B51E6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
export { auth, database };