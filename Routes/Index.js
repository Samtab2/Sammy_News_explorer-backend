const router = require("express").Router();
const newsItemsRouter = require("./newsItem");
const userRouter = require("./Users");
const { createUser, loginUser } = require("../controllers/users");
const authMW = require("../Middleware/Auth");
const NotFound = require("../errors/NotFound");
const {
  validateLogInBody,
  validateSignUpBody,
} = require("../Middleware/validation");

router.use("/items", newsItemsRouter);
router.use("/users", authMW, userRouter);
router.post("/signin", validateLogInBody, loginUser);
router.post("/signup", validateSignUpBody, createUser);

router.use(() => {
  next(new NotFound("Not found"));
});

module.exports = router;
