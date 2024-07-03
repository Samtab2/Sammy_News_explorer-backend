const newsItems = require("../Models/NewsItems");
const {
  Request_Successful,
  Request_Created,
} = require("../utlis/Succesful-Created");

const NotFound = require("../errors/NotFound");
const Forbidden = require("../errors/Forbidden");
const BadRequest = require("../errors/BadRequest");

// Create
const postNews = (req, res, next) => {
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
      owner: req.user._id,
    })
    .then((item) => res.status(Request_Created).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

// Get
const getNewsItems = (req, res, next) => {
  newsItems
    .find({})
    .then((item) => res.status(Request_Successful).send(item))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

// Delete
const deleteNews = (req, res, next) => {
  const { id } = req.params;
  newsItems
    .findbyId(id)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return next(
          new Forbidden("You are not authorized to delete this item")
        );
      }
      return item
        .deleteOne()
        .then(() => {
          res.send({ message: "Item deleted" });
        })
        .catch((err) => {
          console.error(err);
          if (err.name === "DocumentNotFoundError") {
            next(new NotFound("Not found"));
          }
          if (err.name === "CastError") {
            next(new BadRequest("Bad request"));
            next(err);
          }
        });
    });
};

module.exports = {
  postNews,
  getNewsItems,
  deleteNews,
};
