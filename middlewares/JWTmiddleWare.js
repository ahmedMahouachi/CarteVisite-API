const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Access denied, no token provided" });
  }

  jwt.verify(token, "secretJWT", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded; // Store the user data in the request object
    next();
  });
};

module.exports = verifyToken;
