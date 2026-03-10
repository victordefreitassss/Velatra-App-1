
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVbNzE1KH--RY3_sfHObAPHGJpEeUEvMs",
  authDomain: "natif-body-app-final.firebaseapp.com",
  projectId: "natif-body-app-final",
  storageBucket: "natif-body-app-final.firebasestorage.app",
  messagingSenderId: "826325961834",
  appId: "1:826325961834:web:1955908a757e65f9324e13"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  updateDoc,
  deleteDoc,
  query,
  where
};
