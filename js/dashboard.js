// variabel global
let dataJson = [];
let monthChart = null;
let myChart = null;
let weekdayChart = null;
let timeChart = null;

// fungsi filter berdasarkan tanggal
function logSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  console.log(formData.get("date"));
  const latest = new Date("2023-06-31");
  const current = new Date(formData.get("date"));

  if (current.getTime() > latest.getTime()) {
    alert("Tanggal Tidak Valid");
    return;
  }
  const newData = dataJson.filter(
    (x) => x["transaction_date"] == formData.get("date")
  );
  tampilStore(newData);
  tampilBulan(newData);
  tampilDay(newData);
  tampilTimeChart(newData);
}
const form = document.getElementById("form");
form.addEventListener("submit", logSubmit);

const optionsChart = {
  responsive: true, // Membuat grafik responsif
  maintainAspectRatio: false, // Mengabaikan rasio aspek
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// fungsi load data
async function fetchData() {
  const url = "../data/data.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const datapoints = await response.json();
    console.log("Fetched data:", datapoints);

    dataJson = datapoints;

    return datapoints;
  } catch (error) {
    console.error("Fetch error: ", error);
  }
}

// fungsi tampil store
function tampilStore(data) {
  if (myChart == null) {
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
    myChart = new Chart(document.getElementById("myChart"), config);
  }

  // bar chart store
  let salesByStore = {};
  data.forEach((item) => {
    const storeLocation = item.store_location;
    const transactionQty = parseInt(item.transaction_qty);

    if (salesByStore[storeLocation]) {
      salesByStore[storeLocation] += transactionQty;
    } else {
      salesByStore[storeLocation] = transactionQty;
    }
  });

  // Memperbarui label dan data pada grafik
  myChart.config.data.labels = Object.keys(salesByStore);
  myChart.config.data.datasets[0].data = Object.values(salesByStore);
  myChart.update();
}

function tampilBulan(data) {
  if (monthChart == null) {
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
    monthChart = new Chart(document.getElementById("monthChart"), config);
  }
  // bar chart
  let salesByMonth = {};
  data.forEach((item) => {
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
}
function tampilDay(data) {
  if (weekdayChart == null) {
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
    weekdayChart = new Chart(document.getElementById("weekdayChart"), config);
  }
  // bar chart
  let salesByWeekday = {};
  data.forEach((item) => {
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
}
function tampilTimeChart(data) {
  if (timeChart == null) {
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
    timeChart = new Chart(document.getElementById("timeChart"), config);
  }
  let dailySales = {};

  // Memproses data untuk mendapatkan jumlah penjualan harian
  data.forEach((item) => {
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
  const dataa = Object.values(dailySales);

  // Memperbarui label dan data pada grafik
  timeChart.config.data.labels = labels; // Memperbarui labels
  timeChart.config.data.datasets[0].data = dataa; // Memperbarui data
  timeChart.update();
}

// fungsi memanggil dan menampilkan data
document.addEventListener("DOMContentLoaded", async function () {
  await fetchData();
  console.log(dataJson);
  tampilStore(dataJson);
  tampilBulan(dataJson);
  tampilDay(dataJson);
  tampilTimeChart(dataJson);
});
