const newsItems = require("../Models/NewsItems");
const {
  Request_Successful,
  Request_Created,
} = require("../utlis/Succesful-Created");

const NotFound = require("../errors/NotFound");
const Forbidden = require("../errors/Forbidden");
const BadRequest = require("../errors/BadRequest");

// Create
const addArticle = (req, res, next) => {
  const owner = req.user._id;
  const { keyword, title, text, date, source, link, imageUrl } = req.body;
  newsItems
    .create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      imageUrl,
      owner,
    })
    .then((article) => res.status(Request_Created).send({ data: article }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

// Get
const getArticles = (req, res, next) => {
  Articles.find({ owner: req.user._id })
    .then((item) => res.status(Request_Successful).send(item))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

// Delete
const RemoveArticle = (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;
  Article.findbyId(articleId)
    .select("+owner")
    .orFail(() => next(new NotFound("Not found")))
    .then((article) => {
      if (userId !== article.owner.toString()) {
        next;
        new Forbidden("You are not authorized to delete this item");
      }
      return Article.findByIdAndRemove(articleId)
        .orFail(() => next(new NotFound("Not found")))
        .then((removedArticle) => res.send(removedArticle))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  addArticle,
  getArticles,
  RemoveArticle,
};
