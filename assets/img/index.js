function displayCurrentTime() {
  var options = { hour12: false }; // Menonaktifkan AM/PM
  document.getElementById("current-time").textContent =
    new Date().toLocaleTimeString("en-US", options);
}

displayCurrentTime();
setInterval(displayCurrentTime, 1000);
