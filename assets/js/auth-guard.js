import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    let data = null;

    /* =========================
       MODERN (UID BASED)
    ========================= */
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      data = docSnap.data();
    } else {
      /* =========================
         LEGACY FALLBACK (username based)
      ========================= */
      const username = user.email.split("@")[0];

      const q = query(
        collection(db, "users"),
        where("username", "==", username),
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        data = snap.docs[0].data();
      } else {
        console.error("User tidak ditemukan di Firestore");
        return;
      }
    }

    /* =========================
       GLOBAL USER
    ========================= */
    window.currentUser = {
      uid: user.uid,
      username: data.username,
      nama: data.nama,
      email: user.email,
      role: data.role || "pegawai",
    };

    /* =========================
       UI UPDATE
    ========================= */
    const el = document.getElementById("userInfo");
    if (el) {
      el.innerText = data.nama;
    }
  } catch (err) {
    console.error("Error ambil data user:", err);
  }
});
