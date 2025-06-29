// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import {
    getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection, query,
    getDoc, getDocs, addDoc, where, writeBatch
} from "firebase/firestore";

// IMPORTANT: Replace the following firebaseConfig with YOUR OWN Firebase project configuration!
// You can find this in your Firebase project settings -> Project settings -> General -> Your apps (Web app)
const firebaseConfig = {
    apiKey: "AIzaSyAHowpOHnCOaQ5eackHV__Bo3M42437lXQ", // Replace with your actual apiKey
    authDomain: "daily-discussion-1040d.firebaseapp.com", // Replace with your actual authDomain
    projectId: "daily-discussion-1040d", // Replace with your actual projectId
    storageBucket: "daily-discussion-1040d.firebasestorage.app", // Replace with your actual storageBucket
    messagingSenderId: "647593805968", // Replace with your actual messagingSenderId
    appId: "1:647593805968:web:321f52517221267163f015", // Replace with your actual appId
    measurementId: "G-YB5N6Q6MDZ" // Optional: Replace with your actual measurementId if using Analytics
};

let app, db, auth;
// Use firebaseConfig.projectId as the app_id, removing any reliance on __app_id global.
const app_id = firebaseConfig.projectId;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    console.log("Firebase SDKs initialized successfully.");

} catch (error) {
    console.error("Error initializing Firebase SDKs:", error);
    // In a production app, you might render an error message to the user here.
}

// Export the initialized Firebase app, auth, and db instances.
// Also re-export all specific Firestore and Auth functions for modular usage.
export {
    app,
    db,
    auth,
    app_id, // Export the app_id derived from projectId

    // Firestore functions
    doc,
    setDoc,
    deleteDoc,
    onSnapshot, // Assuming onSnapshot is also needed and used
    collection,
    query,
    where,
    getDoc,
    getDocs,
    addDoc,
    writeBatch,

    // Auth functions
    signOut // Export signOut directly
};