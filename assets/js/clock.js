// Fungsi update jam di kanan atas
function updateClock() {
  const now = new Date();
  const jam = now.getHours().toString().padStart(2, "0");
  const menit = now.getMinutes().toString().padStart(2, "0");
  const detik = now.getSeconds().toString().padStart(2, "0");
  document.getElementById("clock").textContent = `${jam}:${menit}:${detik}`;
}
setInterval(updateClock, 1000);
updateClock();
