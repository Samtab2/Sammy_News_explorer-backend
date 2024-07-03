const router = require("express").Router();
const getUser = require("../controllers/Users");
const authMW = require("../Middleware/Auth");

router.get("/", authMW, getUser);

module.exports = router;
