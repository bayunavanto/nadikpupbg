// auth-guard.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // ambil username dari email
  const username = user.email.split("@")[0];

  try {
    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // simpan global
      window.currentUser = {
        uid: user.uid,
        username: username,
        nama: data.nama,
        email: user.email,
      };

      // tampilkan kalau ada element
      const el = document.getElementById("userInfo");
      if (el) {
        el.innerText = data.nama;
      }
    } else {
      console.error("User tidak ditemukan di Firestore");
    }
  } catch (err) {
    console.error("Error ambil data user:", err);
  }
});
