document.addEventListener("DOMContentLoaded", function () {
  // Render init block
  const totalRevenueCard = document.getElementById("totalRevenue");

  async function fetchData() {
    const url = "../data/data.json"; // Sesuaikan port jika diperlukan
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const datapoints = await response.json();
      console.log("Fetched data:", datapoints);
      return datapoints;
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  }

  function calculateTotalRevenue(datapoints) {
    let totalRevenue = 0;
    datapoints.forEach((item) => {
      totalRevenue += parseFloat(item.revenue);
    });
    return totalRevenue.toFixed(2); // Mengambil dua angka di belakang koma
  }

  function displayTotalRevenue(totalRevenue) {
    totalRevenueCard.innerText = "$" + totalRevenue; // Menampilkan total pendapatan di dalam card
  }

  function updateTotalRevenue() {
    fetchData().then((datapoints) => {
      if (!datapoints) {
        console.error("No data fetched");
        return;
      }

      const totalRevenue = calculateTotalRevenue(datapoints);
      console.log("Total revenue:", totalRevenue);

      displayTotalRevenue(totalRevenue);
    });
  }

  // Memanggil fungsi untuk mengupdate total pendapatan saat halaman dimuat
  updateTotalRevenue();
});
