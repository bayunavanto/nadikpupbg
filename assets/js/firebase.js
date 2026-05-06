// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJD1ZJBtNKE66FanF81U-o91VBNDCk148",
  authDomain: "nadikpupbgv1.firebaseapp.com",
  projectId: "nadikpupbgv1",
  storageBucket: "nadikpupbgv1.firebasestorage.app",
  messagingSenderId: "613056700971",
  appId: "1:613056700971:web:0c1f9fc363cf04e05b406e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
