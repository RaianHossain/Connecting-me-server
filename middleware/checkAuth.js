// authMiddleware.js
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  // check if path is /auth

  if (
    req.path === "/auth/refresh-token" ||
    req.path === "/auth/login" ||
    req.path === "/auth/register" ||
    req.path === "/auth/users"
  ) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Please Provide Valid Token" }); // Unauthorized
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid Token" }); // Forbidden
    }

    if (decoded.type !== "access") {
      return res.status(403).json({ error: "Invalid Token Type" }); // Forbidden
    }

    req.claims = decoded; 
    next(); 
  });
};

module.exports = checkAuth;
