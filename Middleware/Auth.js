const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utlis/config");
const Unauthorized = require("../errors/UnAuthorized");

const authMW = (req, res, next) => {
  console.log("Missing or invalid Authorization header");
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new Unauthorized("Unauthorized: Invalid token"));
  }
  const token = authHeader.replace("Bearer ", "");

  return jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      next(new Unauthorized("Unauthorized: Invalid token"));
    }
    req.user = payload;
    return next();
  });
};
module.exports = authMW;
