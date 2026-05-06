import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { db } from "./firebase.js";

const btn = document.getElementById("btnDownload");

// async function loadUsers() {
//   const select = document.getElementById("username");

//   const snapshot = await getDocs(collection(db, "users"));

//   snapshot.forEach((doc) => {
//     const user = doc.data();

//     const option = document.createElement("option");
//     option.value = user.username; // ini yang dipakai query
//     option.textContent = user.nama; // ini yang ditampilkan

//     select.appendChild(option);
//   });
// }

// loadUsers();

btn.addEventListener("click", async () => {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const username = document.getElementById("username").value.trim();
  // const username = null;

  if (!startDate || !endDate) {
    Swal.fire("Oops", "Tanggal harus diisi", "warning");
    return;
  }

  // VALIDASI RANGE MAKSIMAL 2 BULAN
  const start = new Date(startDate);
  const end = new Date(endDate);

  // hitung selisih hari
  const diffTime = end - start;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    Swal.fire("Oops", "Tanggal tidak valid", "warning");
    return;
  }

  if (diffDays > 62) {
    Swal.fire("Batas Maksimal", "Penarikan data maksimal 2 bulan", "warning");
    return;
  }

  btn.disabled = true;
  btn.innerText = "Memproses...";

  try {
    let q;

    if (username) {
      q = query(
        collection(db, "absensi"),
        where("tanggal", ">=", startDate),
        where("tanggal", "<=", endDate),
        where("username", "==", username),
      );
    } else {
      q = query(
        collection(db, "absensi"),
        where("tanggal", ">=", startDate),
        where("tanggal", "<=", endDate),
      );
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      Swal.fire("Info", "Data tidak ditemukan", "info");
      btn.disabled = false;
      btn.innerText = "⬇️ Download CSV";
      return;
    }

    let csv = "Nama;Username;Tanggal;Jam Masuk;Jam Keluar\n";

    snapshot.forEach((doc) => {
      const d = doc.data();
      csv += `"${d.nama}";${d.username};${d.tanggal};${d.jamMasuk || "-"};${d.jamKeluar || "-"}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `absensi_${startDate}_to_${endDate}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Terjadi kesalahan saat download", "error");
  }

  btn.disabled = false;
  btn.innerText = "⬇️ Download CSV";
});
