import { auth, db } from "./firebase.js";

import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const btn = document.getElementById("btnCreate");

btn.addEventListener("click", async () => {
  const nama = document.getElementById("nama").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const aktif = document.getElementById("aktif").value === "true";
  const role = document.getElementById("role").value;

  if (!nama || !username || !password || !role) {
    Swal.fire("Error", "Semua field wajib diisi", "warning");
    return;
  }

  try {
    btn.disabled = true;
    btn.innerHTML = `
      <span class="mini-loader" style="border-top-color: #ffffff"></span>
      Membuat user...
    `;

    const email = `${username}@nadikpupbg.local`;

    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const uid = userCred.user.uid;

    await setDoc(doc(db, "users", uid), {
      uid,
      nama,
      username,
      email,
      role,
      aktif,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "User baru berhasil dibuat",
    }).then(() => {
      window.location.href = "admin.html";
    });

    document.getElementById("nama").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = "pegawai";
    document.getElementById("aktif").value = "true";
  } catch (err) {
    console.error(err);
    Swal.fire("Error", err.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <i class="hgi hgi-stroke hgi-rounded hgi-user-add-01"></i>
      Buat User
    `;
  }
});
