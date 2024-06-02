// Variabel global
let dataJson = [];
let monthChart = null;
let myChart = null;
let weekdayChart = null;
let timeChart = null;
let totalRevenueCard = null;
let totalStoresCard = null;
let totalTransactionsCard = null;
let totalTransactionQuantityCard = null;

const optionsChart = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Fungsi filter data
function filterData() {
  const dateInput = document.getElementById("date").value;
  const storeLocationInput = document.getElementById("storeLocation").value;
  const monthNameInput = document.getElementById("monthName").value;
  const weekdayNameInput = document.getElementById("weekdayName").value;
  const productTypeInput = document.getElementById("productType").value;

  if (
    !dateInput &&
    !storeLocationInput &&
    !monthNameInput &&
    !weekdayNameInput &&
    !productTypeInput
  ) {
    alert("Please select at least one filter before applying.");
    return;
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

  console.log("Filtered data:", filteredData);

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

// Fungsi load data
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

// Fungsi tampil penjualan berdsarkan store
function tampilStore(data) {
  if (myChart == null) {
    const config = {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Sales by Store",
            data: [],
            backgroundColor: "#dbba8f",
            borderColor: "rgba(0, 0, 0, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        ...optionsChart,
        onClick: (_e, activeEls) => {
          if (activeEls.length > 0) {
            const dataIndex = activeEls[0].index;
            const label = myChart.data.labels[dataIndex];
            const filteredData = dataJson.filter(
              (item) => item.store_location === label
            );
            updateCharts(filteredData);
          }
        },
      },
    };

    myChart = new Chart(document.getElementById("myChart"), config);
  }

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

  myChart.config.data.labels = Object.keys(salesByStore);
  myChart.config.data.datasets[0].data = Object.values(salesByStore);
  myChart.update();
}

// fungsi chart tampil penjualan berdasarkan bulan
function tampilBulan(data) {
  if (monthChart == null) {
    const config = {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Sales by Month",
            data: [],
            backgroundColor: "#dbba8f",
            borderColor: "rgba(0, 0, 0, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        ...optionsChart,
        onClick: (e, activeEls) => {
          if (activeEls.length > 0) {
            const dataIndex = activeEls[0].index;
            const label = monthChart.data.labels[dataIndex];
            const filteredData = dataJson.filter(
              (item) => item.month_name === label
            );
            updateCharts(filteredData);
          }
        },
      },
    };

    monthChart = new Chart(document.getElementById("monthChart"), config);
  }

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

  monthChart.config.data.labels = Object.keys(salesByMonth);
  monthChart.config.data.datasets[0].data = Object.values(salesByMonth);
  monthChart.update();
}

// fungsi chart tampil data penjualan berdasarkan hari
function tampilDay(data) {
  if (weekdayChart == null) {
    const config = {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Sales by Weekday",
            data: [],
            backgroundColor: "#dbba8f",
            borderColor: "rgba(0, 0, 0, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        ...optionsChart,
        onClick: (e, activeEls) => {
          if (activeEls.length > 0) {
            const dataIndex = activeEls[0].index;
            const label = weekdayChart.data.labels[dataIndex];
            const filteredData = dataJson.filter(
              (item) => item.weekday_name === label
            );
            updateCharts(filteredData);
          }
        },
      },
    };

    weekdayChart = new Chart(document.getElementById("weekdayChart"), config);
  }

  let salesByWeekday = {};
  data.forEach((item) => {
    const weekdayName = item.weekday_name;
    const transactionQty = parseInt(item.transaction_qty);

    if (salesByWeekday[weekdayName]) {
      salesByWeekday[weekdayName] += transactionQty;
    } else {
      salesByWeekday[weekdayName] = transactionQty;
    }
  });

  const sortedSalesByWeekday = Object.entries(salesByWeekday).sort((a, b) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek.indexOf(a[0]) - daysOfWeek.indexOf(b[0]);
  });

  weekdayChart.config.data.labels = sortedSalesByWeekday.map(
    (entry) => entry[0]
  );
  weekdayChart.config.data.datasets[0].data = sortedSalesByWeekday.map(
    (entry) => entry[1]
  );
  weekdayChart.update();
}

// fungsi time chart untuk menampilkan daily sales
function tampilTimeChart(data) {
  if (timeChart == null) {
    const config = {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Daily Sales",
            data: [],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#936e59",
            borderWidth: 1,
            pointRadius: 0.5,
          },
        ],
      },
      options: {
        ...optionsChart,
        onClick: (e, activeEls) => {
          if (activeEls.length > 0) {
            const dataIndex = activeEls[0].index;
            const label = timeChart.data.labels[dataIndex];
            const filteredData = dataJson.filter(
              (item) => item.transaction_date === label
            );
            updateCharts(filteredData);
          }
        },
      },
    };

    timeChart = new Chart(document.getElementById("timeChart"), config);
  }

  let dailySales = {};
  data.forEach((item) => {
    const date = item.transaction_date;
    const transactionQty = parseInt(item.transaction_qty);

    if (dailySales[date]) {
      dailySales[date] += transactionQty;
    } else {
      dailySales[date] = transactionQty;
    }
  });

  console.log("Daily Sales:", dailySales);

  timeChart.config.data.labels = Object.keys(dailySales);
  timeChart.config.data.datasets[0].data = Object.values(dailySales);
  timeChart.update();
}

// fungsi untuk menampilkan penjualan berdasarkan product type di tabel
function productTypeTable(data) {
  const tableBody = document.querySelector("#transactionsTable tbody");
  const aggregatedData = {};

  // Mengumpulkan data dan menghitung total transaction_qty
  let totalTransactionQty = 0;

  data.forEach((item) => {
    const productType = item.product_type;
    const transactionQty = parseInt(item.transaction_qty);

    if (aggregatedData[productType]) {
      aggregatedData[productType] += transactionQty;
    } else {
      aggregatedData[productType] = transactionQty;
    }

    totalTransactionQty += transactionQty;
  });

  // Mengonversi objek aggregatedData menjadi array
  const aggregatedArray = Object.entries(aggregatedData).map(
    ([product_type, transaction_qty]) => ({ product_type, transaction_qty })
  );

  // Mengurutkan array berdasarkan transaction_qty
  aggregatedArray.sort((a, b) => b.transaction_qty - a.transaction_qty);

  // Membersihkan isi tabel
  tableBody.innerHTML = "";

  // Menambahkan data ke tabel dengan kolom persentase
  aggregatedArray.forEach((item) => {
    const row = document.createElement("tr");

    const productTypeCell = document.createElement("td");
    productTypeCell.textContent = item.product_type;
    row.appendChild(productTypeCell);

    const transactionQtyCell = document.createElement("td");
    transactionQtyCell.textContent = item.transaction_qty;
    row.appendChild(transactionQtyCell);

    const percentageCell = document.createElement("td");
    const percentage = (
      (item.transaction_qty / totalTransactionQty) *
      100
    ).toFixed(2);
    percentageCell.textContent = `${percentage}%`;
    row.appendChild(percentageCell);

    tableBody.appendChild(row);
  });
}

// fungsi untuk card menampilkan total revenue
function updateTotalRevenue(data) {
  totalRevenueCard = document.getElementById("totalRevenue");

  let totalRevenue = 0;
  data.forEach((item) => {
    totalRevenue += parseFloat(item.revenue);
  });
  totalRevenue = totalRevenue.toFixed(2);

  totalRevenueCard.innerText = "$" + totalRevenue;
  console.log("Total revenue:", totalRevenue);
}

// fungsi card untuk menampilkan total store
function updateTotalStores(data) {
  totalStoresCard = document.getElementById("totalStore");

  let stores = new Set();
  data.forEach((item) => {
    stores.add(item.store_location);
  });
  const totalStores = stores.size;

  totalStoresCard.innerText = totalStores;
  console.log("Total stores:", totalStores);
}

// fungsi store untuk menampilkan total transaction
function updateTotalTransactions(data) {
  totalTransactionsCard = document.getElementById("totalTransactions");

  const totalTransactions = data.length;

  totalTransactionsCard.innerText = totalTransactions;
  console.log("Total transactions:", totalTransactions);
}

// fungsi card untuk menampilkan jumlah penjualan
function updateTotalTransactionQuantity(data) {
  totalTransactionQuantityCard = document.getElementById(
    "totalTransactionQuantity"
  );

  let totalTransactionQuantity = 0;
  data.forEach((item) => {
    totalTransactionQuantity += parseInt(item.transaction_qty);
  });

  totalTransactionQuantityCard.innerText = totalTransactionQuantity;
  console.log("Total transaction quantity:", totalTransactionQuantity);
}

// fungsi filtered data berdasarkan chart yang di klik
function updateCharts(filteredData) {
  tampilStore(filteredData);
  tampilBulan(filteredData);
  tampilDay(filteredData);
  tampilTimeChart(filteredData);
  updateTotalRevenue(filteredData);
  updateTotalStores(filteredData);
  updateTotalTransactions(filteredData);
  updateTotalTransactionQuantity(filteredData);
  productTypeTable(filteredData);
}

// untuk menampilkan data
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
