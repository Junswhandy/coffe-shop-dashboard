// fungsi options
const optionsChart = {
  responsive: true, // Membuat grafik responsif
  maintainAspectRatio: false, // Mengabaikan rasio aspek
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

//
// time series
document.addEventListener("DOMContentLoaded", function () {
  // Konfigurasi dasar untuk chart
  const config = {
    type: "line", // Mengubah jenis chart menjadi line
    data: {
      labels: [], // Akan diisi dengan tanggal
      datasets: [
        {
          label: "Daily Sales", // Ubah label dataset
          data: [], // Akan diisi dengan jumlah penjualan harian
          backgroundColor: "rgba(255, 255, 255, 1)", // Putih
          borderColor: "rgba(255, 255, 255, 1)", // Hitam
          borderWidth: 0.5,
          pointRadius: 0.5,
        },
      ],
    },
    options: {
      responsive: true, // Membuat grafik responsif
      maintainAspectRatio: false, // Mengabaikan rasio aspek
      layout: {
        padding: {
          top: 0, // Atur jarak atas (top) dari grafik
          bottom: 0, // Atur jarak bawah (bottom) dari grafik
          left: 0, // Atur jarak kiri (left) dari grafik
          right: 0, // Atur jarak kanan (right) dari grafik
        },
        height: 400, // Atur tinggi grafik
      },
      scales: {
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            // Atur tinggi sumbu Y
            min: 0, // Nilai minimum
            max: 100, // Nilai maksimum
            stepSize: 50, // Ukuran langkah
          },
        },
      },
    },
  };

  // Render init block
  const timeChart = new Chart(document.getElementById("timeChart"), config);

  // Instantly assign Chart.js version
  const chartVersion = document.getElementById("timeChart");
  chartVersion.innerText = Chart.version;

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

  function updateChart() {
    fetchData().then((datapoints) => {
      if (!datapoints) {
        console.error("No data fetched");
        return;
      }

      // Menyiapkan objek untuk menyimpan penjualan harian
      let dailySales = {};

      // Memproses data untuk mendapatkan jumlah penjualan harian
      datapoints.forEach((item) => {
        const date = item.transaction_date; // Anggap ada properti date dalam data
        const transactionQty = parseInt(item.transaction_qty);

        // Mengecek apakah tanggal sudah ada dalam objek
        if (dailySales[date]) {
          dailySales[date] += transactionQty;
        } else {
          dailySales[date] = transactionQty;
        }
      });

      console.log("Daily Sales:", dailySales);

      // Mengubah format objek ke dalam array untuk labels dan data
      const labels = Object.keys(dailySales);
      const data = Object.values(dailySales);

      // Memperbarui label dan data pada grafik
      timeChart.config.data.labels = labels; // Memperbarui labels
      timeChart.config.data.datasets[0].data = data; // Memperbarui data
      timeChart.update();
    });
  }

  // Memanggil fungsi untuk memperbarui grafik saat halaman dimuat
  updateChart();
});

// bar chart store
document.addEventListener("DOMContentLoaded", function () {
  // Konfigurasi dasar untuk chart
  const config = {
    type: "bar",
    data: {
      labels: [], // Akan diisi dengan lokasi toko
      datasets: [
        {
          label: "Sales by Store",
          data: [], // Akan diisi dengan jumlah penjualan
          backgroundColor: "rgba(255, 255, 255, 1)", // Putih
          borderColor: "rgba(0, 0, 0, 1)", // Hitam
          borderWidth: 2,
        },
      ],
    },
    options: optionsChart,
  };

  // Render init block
  const myChart = new Chart(document.getElementById("myChart"), config);

  // Instantly assign Chart.js version
  const chartVersion = document.getElementById("myChart");
  chartVersion.innerText = Chart.version;

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

  function updateChart() {
    fetchData().then((datapoints) => {
      if (!datapoints) {
        console.error("No data fetched");
        return;
      }

      // Memproses data untuk mendapatkan lokasi toko dan jumlah penjualan
      let salesByStore = {};
      datapoints.forEach((item) => {
        const storeLocation = item.store_location;
        const transactionQty = parseInt(item.transaction_qty);

        if (salesByStore[storeLocation]) {
          salesByStore[storeLocation] += transactionQty;
        } else {
          salesByStore[storeLocation] = transactionQty;
        }
      });

      console.log("Sales by store:", salesByStore);

      // Memperbarui label dan data pada grafik
      myChart.config.data.labels = Object.keys(salesByStore); // Memperbarui labels
      myChart.config.data.datasets[0].data = Object.values(salesByStore); // Memperbarui data

      myChart.update();
    });
  }

  // Memanggil fungsi untuk memperbarui grafik saat halaman dimuat
  updateChart();
});

// bar chart month
document.addEventListener("DOMContentLoaded", function () {
  // Konfigurasi dasar untuk chart
  const config = {
    type: "bar",
    data: {
      labels: [], // Akan diisi dengan nama bulan
      datasets: [
        {
          label: "Sales by Month",
          data: [], // Akan diisi dengan jumlah penjualan
          backgroundColor: "rgba(255, 255, 255, 1)", // Putih
          borderColor: "rgba(0, 0, 0, 1)", // Hitam
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true, // Membuat grafik responsif
      maintainAspectRatio: false, // Mengabaikan rasio aspek
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  // Render init block
  const monthChart = new Chart(document.getElementById("monthChart"), config);

  // Instantly assign Chart.js version
  const chartVersion = document.getElementById("monthChart");
  chartVersion.innerText = Chart.version;

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

  function updateChart() {
    fetchData().then((datapoints) => {
      if (!datapoints) {
        console.error("No data fetched");
        return;
      }

      // Memproses data untuk mendapatkan bulan dan jumlah penjualan
      let salesByMonth = {};
      datapoints.forEach((item) => {
        const monthName = item.month_name;
        const transactionQty = parseInt(item.transaction_qty);

        if (salesByMonth[monthName]) {
          salesByMonth[monthName] += transactionQty;
        } else {
          salesByMonth[monthName] = transactionQty;
        }
      });

      console.log("Sales by month:", salesByMonth);

      // Memperbarui label dan data pada grafik
      monthChart.config.data.labels = Object.keys(salesByMonth); // Memperbarui labels
      monthChart.config.data.datasets[0].data = Object.values(salesByMonth); // Memperbarui data

      monthChart.update();
    });
  }

  // Memanggil fungsi untuk memperbarui grafik saat halaman dimuat
  updateChart();
});

// bar chart weekday
document.addEventListener("DOMContentLoaded", function () {
  // Konfigurasi dasar untuk chart
  const config = {
    type: "bar",
    data: {
      labels: [], // Akan diisi dengan nama hari
      datasets: [
        {
          label: "Sales by Weekday",
          data: [], // Akan diisi dengan jumlah penjualan
          backgroundColor: "rgba(255, 255, 255, 1)", // Putih
          borderColor: "rgba(0, 0, 0, 1)", // Hitam
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true, // Membuat grafik responsif
      maintainAspectRatio: false, // Mengabaikan rasio aspek
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  // Render init block
  const weekdayChart = new Chart(
    document.getElementById("weekdayChart"),
    config
  );

  // Instantly assign Chart.js version
  const chartVersion = document.getElementById("weekdayChart");
  chartVersion.innerText = Chart.version;

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

  function updateChart() {
    fetchData().then((datapoints) => {
      if (!datapoints) {
        console.error("No data fetched");
        return;
      }

      // Memproses data untuk mendapatkan hari dan jumlah penjualan
      let salesByWeekday = {};
      datapoints.forEach((item) => {
        const weekday = item.weekday; // Misalnya, field weekday menyimpan angka (0 untuk Minggu, 1 untuk Senin, dst.)
        const transactionQty = parseInt(item.transaction_qty);

        if (salesByWeekday[weekday]) {
          salesByWeekday[weekday] += transactionQty;
        } else {
          salesByWeekday[weekday] = transactionQty;
        }
      });

      // Mengonversi objek menjadi array dan mengurutkannya berdasarkan field weekday
      const sortedSalesByWeekday = Object.entries(salesByWeekday).sort(
        (a, b) => a[0] - b[0]
      );

      console.log("Sorted Sales by weekday:", sortedSalesByWeekday);

      // Mengonversi angka hari kembali menjadi nama hari
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      // Memperbarui label dan data pada grafik
      weekdayChart.config.data.labels = sortedSalesByWeekday.map(
        (entry) => daysOfWeek[entry[0]]
      ); // Memperbarui labels
      weekdayChart.config.data.datasets[0].data = sortedSalesByWeekday.map(
        (entry) => entry[1]
      ); // Memperbarui data

      weekdayChart.update();
    });
  }

  // Memanggil fungsi untuk memperbarui grafik saat halaman dimuat
  updateChart();
});
