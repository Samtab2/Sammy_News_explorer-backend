const router = require("express").Router();
const { getUser } = require("../controllers/users");
const authMW = require("../Middleware/Auth");

router.get("/me", authMW, getUser);

module.exports = router;
