const router = require("express").Router();

const {
  getArticles,
  addArticle,
  RemoveArticle,
} = require("../controllers/NewsItems");

const { validateNewsBody, validateId } = require("../Middleware/validation");

const authMW = require("../Middleware/Auth");

// Get
router.get("/", getArticles);

// Post
router.post("/", authMW, validateNewsBody, addArticle);

// Delete
router.delete("/:id", authMW, validateId, RemoveArticle);

module.exports = router;
