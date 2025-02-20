const jwt = require("jsonwebtoken");
// const blacklist = require("../blacklist");
// const User = require("../models/user.model");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).send({ message: "Authentication token require" });
  }
  jwt.verify(token, "bookStore123", (err, user) => {
    if (err) {
      return res
        .status(401)
        .send({ message: "Your token is expire...Please login again" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
