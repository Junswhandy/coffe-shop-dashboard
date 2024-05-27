// variabel global
let dataJson = [];
let monthChart = null;
let myChart = null;
let weekdayChart = null;
let timeChart = null;
let totalRevenueCard = null;
let totalStoresCard = null;
let totalTransactionsCard = null;
let totalTransactionQuantityCard = null;

// Fungsi filter data
function filterData() {
  const dateInput = document.getElementById("date").value;
  const storeLocationInput = document.getElementById("storeLocation").value;
  const monthNameInput = document.getElementById("monthName").value;
  const weekdayNameInput = document.getElementById("weekdayName").value;
  const productTypeInput = document.getElementById("productType").value;

  // Mengecek apakah semua filter kosong
  if (
    !dateInput &&
    !storeLocationInput &&
    !monthNameInput &&
    !weekdayNameInput &&
    !productTypeInput
  ) {
    alert("Please select at least one filter before applying.");
    return; // Menghentikan eksekusi fungsi jika tidak ada filter yang dipilih
  }

  let filteredData = dataJson;

  if (dateInput) {
    const selectedDate = new Date(dateInput);
    const latest = new Date("2023-06-31");

    if (selectedDate.getTime() > latest.getTime()) {
      alert("Tanggal Tidak Valid");
      return;
    }

    filteredData = filteredData.filter(
      (x) => x["transaction_date"] === dateInput
    );
  }

  if (storeLocationInput) {
    filteredData = filteredData.filter(
      (x) => x["store_location"] === storeLocationInput
    );
  }

  if (monthNameInput) {
    filteredData = filteredData.filter(
      (x) => x["month_name"] === monthNameInput
    );
  }

  if (weekdayNameInput) {
    filteredData = filteredData.filter(
      (x) => x["weekday_name"] === weekdayNameInput
    );
  }

  if (productTypeInput) {
    filteredData = filteredData.filter(
      (x) => x["product_type"] === productTypeInput
    );
  }

  console.log("Filtered data:", filteredData); // Log data yang telah difilter

  tampilStore(filteredData);
  tampilBulan(filteredData);
  tampilDay(filteredData);
  tampilTimeChart(filteredData);
  updateTotalRevenue(filteredData);
  updateTotalStores(filteredData);
  updateTotalTransactionQuantity(filteredData);
  updateTotalTransactions(filteredData);
  productTypeTable(filteredData);
}

// Fungsi untuk menghapus filter dan menampilkan data asli
function clearFilters() {
  document.getElementById("filterForm").reset();
  tampilStore(dataJson);
  tampilBulan(dataJson);
  tampilDay(dataJson);
  tampilTimeChart(dataJson);
  updateTotalRevenue(dataJson);
  updateTotalStores(dataJson);
  updateTotalTransactionQuantity(dataJson);
  updateTotalTransactions(dataJson);
  productTypeTable(dataJson);
}

// Menambahkan event listener ke tombol filter
document.getElementById("filterBtn").addEventListener("click", filterData);
document.getElementById("clearBtn").addEventListener("click", clearFilters);

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
// Fungsi untuk memproses data dan mengisi tabel
// Fungsi untuk memproses data dan mengisi tabel
function productTypeTable(data) {
  const tableBody = document.querySelector("#transactionsTable tbody");
  const aggregatedData = {};

  // Menghitung total transaction_qty per product_type
  data.forEach((item) => {
    const productType = item.product_type;
    const transactionQty = parseInt(item.transaction_qty);

    if (aggregatedData[productType]) {
      aggregatedData[productType] += transactionQty;
    } else {
      aggregatedData[productType] = transactionQty;
    }
  });

  // Convert aggregatedData to an array
  const aggregatedArray = Object.entries(aggregatedData).map(
    ([product_type, transaction_qty]) => ({ product_type, transaction_qty })
  );

  // Mengurutkan array berdasarkan transaction_qty dari yang terbesar ke yang terkecil
  aggregatedArray.sort((a, b) => b.transaction_qty - a.transaction_qty);

  // Clear existing rows
  tableBody.innerHTML = "";

  // Menambahkan baris ke tabel (menampilkan hanya 7 data pertama)
  aggregatedArray.slice(0, 7).forEach((item) => {
    const row = document.createElement("tr");

    const productTypeCell = document.createElement("td");
    productTypeCell.textContent = item.product_type;
    row.appendChild(productTypeCell);

    const transactionQtyCell = document.createElement("td");
    transactionQtyCell.textContent = item.transaction_qty;
    row.appendChild(transactionQtyCell);

    tableBody.appendChild(row);
  });

  // Menambahkan baris sisa data ke tabel untuk scrolling
  if (aggregatedArray.length > 7) {
    aggregatedArray.slice(7).forEach((item) => {
      const row = document.createElement("tr");

      const productTypeCell = document.createElement("td");
      productTypeCell.textContent = item.product_type;
      row.appendChild(productTypeCell);

      const transactionQtyCell = document.createElement("td");
      transactionQtyCell.textContent = item.transaction_qty;
      row.appendChild(transactionQtyCell);

      tableBody.appendChild(row);
    });
  }
}

// card section
function updateTotalRevenue(data) {
  totalRevenueCard = document.getElementById("totalRevenue");

  let totalRevenue = 0;
  data.forEach((item) => {
    totalRevenue += parseFloat(item.revenue);
  });
  totalRevenue = totalRevenue.toFixed(2); // Mengambil dua angka di belakang koma

  totalRevenueCard.innerText = "$" + totalRevenue; // Menampilkan total pendapatan di dalam card
  console.log("Total revenue:", totalRevenue);
}

function updateTotalStores(data) {
  totalStoresCard = document.getElementById("totalStore");

  let stores = new Set();
  data.forEach((item) => {
    stores.add(item.store_location);
  });
  const totalStores = stores.size;

  totalStoresCard.innerText = totalStores; // Menampilkan jumlah store di dalam card
  console.log("Total stores:", totalStores);
}

function updateTotalTransactions(data) {
  totalTransactionsCard = document.getElementById("totalTransactions");

  const totalTransactions = data.length;

  totalTransactionsCard.innerText = totalTransactions; // Menampilkan jumlah transaksi di dalam card
  console.log("Total transactions:", totalTransactions);
}

function updateTotalTransactionQuantity(data) {
  totalTransactionQuantityCard = document.getElementById(
    "totalTransactionQuantity"
  );

  let totalTransactionQuantity = 0;
  data.forEach((item) => {
    totalTransactionQuantity += parseInt(item.transaction_qty);
  });

  totalTransactionQuantityCard.innerText = totalTransactionQuantity; // Menampilkan jumlah total transaction_qty di dalam card
  console.log("Total transaction quantity:", totalTransactionQuantity);
}

// fungsi memanggil dan menampilkan data
document.addEventListener("DOMContentLoaded", async function () {
  await fetchData();
  console.log(dataJson);
  tampilStore(dataJson);
  tampilBulan(dataJson);
  tampilDay(dataJson);
  tampilTimeChart(dataJson);
  updateTotalRevenue(dataJson);
  updateTotalStores(dataJson);
  updateTotalTransactions(dataJson);
  updateTotalTransactionQuantity(dataJson);
  productTypeTable(dataJson);
});
