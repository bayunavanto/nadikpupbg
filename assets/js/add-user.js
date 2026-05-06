import { auth, db } from "./firebase.js";

import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   BUTTON INIT
========================= */
const btn = document.getElementById("btnCreate");

/* =========================
   CREATE USER
========================= */
btn.addEventListener("click", async () => {
  const nama = document.getElementById("nama").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const aktif = document.getElementById("aktif").value === "true";

  /* =========================
     VALIDATION SEDERHANA
  ========================= */
  if (!nama || !username || !password) {
    Swal.fire("Error", "Semua field wajib diisi", "warning");
    return;
  }

  try {
    btn.disabled = true;
    btn.innerText = "Membuat user...";

    /* =========================
       GENERATE EMAIL OTOMATIS
    ========================= */
    const email = `${username}@nadikpupbg.local`;

    /* =========================
       CREATE AUTH USER (UID GENERATED)
    ========================= */
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const uid = userCred.user.uid;

    /* =========================
       SAVE FIRESTORE (UID BASED)
    ========================= */
    await setDoc(doc(db, "users", uid), {
      uid,
      nama,
      username,
      email,
      role: "pegawai",
      aktif,
      createdAt: new Date(),
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "User baru berhasil dibuat",
    }).then(() => {
      window.location.href = "dashboard.html";
    });

    /* reset form */
    document.getElementById("nama").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  } catch (err) {
    console.error(err);

    Swal.fire("Error", err.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Buat User";
  }
});
