import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   ELEMENT
========================= */
const namaEl = document.getElementById("nama");
const usernameEl = document.getElementById("username");
const tableBody = document.querySelector("#absensiTable tbody");

/* =========================
   WAIT USER LOGIN
========================= */
const waitUser = setInterval(() => {
  if (window.currentUser) {
    clearInterval(waitUser);
    loadProfile(window.currentUser);
  }
}, 100);

/* =========================
   LOAD PROFILE
========================= */
async function loadProfile(user) {
  if (!user) return;

  namaEl.textContent = user.nama;
  usernameEl.textContent = "@" + user.username;

  await loadAbsensi(user.username);
}

/* =========================
   LOAD ABSENSI
========================= */
async function loadAbsensi(username) {
  try {
    const q = query(
      collection(db, "absensi"),
      where("username", "==", username),
      // orderBy("createdAt", "desc"),
    );

    const snap = await getDocs(q);

    tableBody.innerHTML = "";

    if (snap.empty) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;color:#999">
            Belum ada data absensi
          </td>
        </tr>
      `;
      return;
    }

    const data = [];

    snap.forEach((doc) => {
      data.push(doc.data());
    });

    // urutkan terbaru di atas
    data.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

    data.forEach((d) => {
      tableBody.innerHTML += `
        <tr>
          <td>${d.tanggal || "-"}</td>
          <td>${d.jamMasuk || "-"}</td>
          <td>${d.jamKeluar || "-"}</td>
          <td>${getStatus(d)}</td>
        </tr>
      `;
    });

    // ⛔ PENTING: init DataTables setelah data masuk
    initDataTable();
  } catch (err) {
    console.error("Error load absensi:", err);
  }
}

/* =========================
   STATUS LABEL
========================= */
function getStatus(d) {
  if (!d.jamMasuk) {
    return `<span style="color:#e74c3c">Belum Masuk</span>`;
  }

  if (!d.jamKeluar) {
    return `<span style="color:#f39c12">Belum Keluar</span>`;
  }

  return `<span style="color:#2ecc71">Lengkap</span>`;
}

/* =========================
   DATATABLE INIT (SAFE)
========================= */
function initDataTable() {
  // kalau sudah pernah di-init, destroy dulu
  if ($.fn.DataTable.isDataTable("#absensiTable")) {
    $("#absensiTable").DataTable().destroy();
  }

  $("#absensiTable").DataTable({
    pageLength: 10,
    lengthChange: false,
    searching: true,
    ordering: true,
    responsive: true,
    language: {
      search: "🔍 Cari:",
      paginate: {
        previous: "←",
        next: "→",
      },
      info: "Menampilkan _START_ - _END_ dari _TOTAL_ data",
      emptyTable: "Tidak ada data",
    },
  });
}
