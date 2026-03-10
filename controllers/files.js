const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "../public/data");

exports.getFiles = (req, res) => {
  try {

    const files = fs.readdirSync(PUBLIC_DIR);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const links = files.map(file => ({
      name: file,
      url: `${baseUrl}/public/data/${file}`
    }));

    res.json({
      total: links.length,
      files: links
    });

  } catch (err) {
    res.status(500).json({
      message: "Erreur lecture fichiers",
      error: err.message
    });
  }
};