const router = require("express").Router();

const {
  getNewsItems,
  postNews,
  deleteNews,
} = require("../controllers/NewsItems");

const { validateNewsBody, validateId } = require("../Middleware/validation");

const authMW = require("../Middleware/Auth");

// Get
router.get("/", getNewsItems);

// Post
router.post("/", authMW, validateNewsBody, postNews);

// Delete
router.delete("/:id", authMW, validateId, deleteNews);

module.exports = router;
