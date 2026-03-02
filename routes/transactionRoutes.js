// routes/transactionRoutes.js

const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Massive dataset
router.get("/transactions", transactionController.getTransactions);

// Aggregated statistics
router.get("/transactions/stats", transactionController.getTransactionStats);

// Fraud anomalies simulation
router.get("/transactions/anomalies", transactionController.getAnomalies);

module.exports = router;