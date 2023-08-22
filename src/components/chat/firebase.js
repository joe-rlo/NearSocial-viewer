import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you need Analytics

const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "sharddog-social-chat.firebaseapp.com",
  projectId: "sharddog-social-chat",
  storageBucket: "sharddog-social-chat.appspot.com",
  messagingSenderId: "182752017575",
  appId: "1:182752017575:web:4cf46191ff982e95ef6f82",
  measurementId: "G-Z2XP4RSL6Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Uncomment if you need Analytics

export const db = getFirestore(app); // Export Firestore
