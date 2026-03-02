// controllers/transactionController.js

const crypto = require("crypto");

// --- Utils ---
const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateTransaction = () => {
  const countries = ["US", "FR", "DE", "TN", "UK", "CA"];
  const paymentMethods = ["card", "paypal", "crypto", "bank_transfer"];
  const statuses = ["success", "failed", "pending"];

  const amount = parseFloat((Math.random() * 2000).toFixed(2));

  return {
    transactionId: crypto.randomUUID(),
    userId: "U" + Math.floor(Math.random() * 1000000),
    amount,
    currency: "USD",
    paymentMethod: randomFromArray(paymentMethods),
    status: randomFromArray(statuses),
    country: randomFromArray(countries),
    timestamp: new Date(
      Date.now() - Math.random() * 10000000000
    ).toISOString(),
  };
};

// --- 1️⃣ GET Massive Transactions ---
exports.getTransactions = async (req, res) => {
  const limit = parseInt(req.query.limit) || 1000;
  const page = parseInt(req.query.page) || 1;
  const statusFilter = req.query.status;
  const countryFilter = req.query.country;

  const data = [];

  for (let i = 0; i < limit; i++) {
    const tx = generateTransaction();

    if (statusFilter && tx.status !== statusFilter) continue;
    if (countryFilter && tx.country !== countryFilter) continue;

    data.push(tx);
  }

  res.json({
    page,
    limit,
    totalGenerated: data.length,
    data,
  });
};

// --- 2️⃣ GET Stats ---
exports.getTransactionStats = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10000;

  let totalAmount = 0;
  let success = 0;
  let failed = 0;
  let pending = 0;

  for (let i = 0; i < limit; i++) {
    const tx = generateTransaction();
    totalAmount += tx.amount;

    if (tx.status === "success") success++;
    if (tx.status === "failed") failed++;
    if (tx.status === "pending") pending++;
  }

  res.json({
    totalTransactions: limit,
    totalAmount: totalAmount.toFixed(2),
    averageAmount: (totalAmount / limit).toFixed(2),
    statusBreakdown: {
      success,
      failed,
      pending,
    },
  });
};

// --- 3️⃣ GET Anomalies (Fraud Simulation) ---
exports.getAnomalies = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10000;
  const threshold = parseFloat(req.query.threshold) || 1500;

  const anomalies = [];

  for (let i = 0; i < limit; i++) {
    const tx = generateTransaction();

    if (tx.amount > threshold || tx.country === "TN" && tx.amount > 1200) {
      anomalies.push({
        ...tx,
        anomalyReason:
          tx.amount > threshold
            ? "High amount"
            : "Country risk pattern",
      });
    }
  }

  res.json({
    threshold,
    totalScanned: limit,
    anomaliesFound: anomalies.length,
    anomalies,
  });
};