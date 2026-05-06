export function protectAdmin() {
  const check = setInterval(() => {
    if (window.currentUser) {
      clearInterval(check);

      if (window.currentUser.role !== "admin") {
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Halaman ini hanya untuk admin",
        }).then(() => {
          window.location.href = "dashboard.html";
        });
      }
    }
  }, 50);
}

/* auto-run langsung saat file di-import */
protectAdmin();
