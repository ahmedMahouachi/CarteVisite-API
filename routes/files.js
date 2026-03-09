const express = require("express");
const router = express.Router();

const filesController = require("../controllers/files");

// liste des fichiers
router.get("/", filesController.getFiles);



module.exports = router;