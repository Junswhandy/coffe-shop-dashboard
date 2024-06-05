function displayCurrentTime() {
  var options = { hour12: false }; // Menonaktifkan AM/PM
  document.getElementById("current-time").textContent =
    new Date().toLocaleTimeString("en-US", options);
}

displayCurrentTime();
setInterval(displayCurrentTime, 1000);

// SIDEBAR TOGGLE
let sidebarOpen = false;
const sidebar = document.getElementById("sidebar");

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add("sidebar-responsive");

    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove("sidebar-responsive");
    sidebarOpen = false;
  }
}

function showContent() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("content").style.display = "grid";
}

// Panggil fungsi showContent setelah 3 detik
window.onload = function () {
  setTimeout(showContent, 1000);
};
