// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY + "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN + "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL + "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET + "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID + "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID + "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID + ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
let analytics;

// Initialize databases
const db = getFirestore(app)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

if (app.name && typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

module.exports.auth = auth
module.exports.db = db