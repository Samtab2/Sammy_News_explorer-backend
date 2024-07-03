const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/users");
const {
  Request_Successful,
  Request_Created,
} = require("../utlis/Succesful-Created");

const { JWT_SECRET } = require("../utlis/config");

const NotFound = require("../errors/NotFound");
const BadRequest = require("../errors/BadRequest");
const Conflict = require("../errors/Conflict");
const UnAuthorized = require("../errors/UnAuthorized");

// Create
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email) {
    next(new BadRequest("Email or password is invalid"));
  }

  // If no existing user, create a new one
  return bcrypt
    .hash(password, 10)

    .then((hashedPassword) =>
      User.create({ name, email, password: hashedPassword })
    )
    .then((newUser) =>
      res.status(Request_Created).send({
        name: newUser.name,
        email: newUser.email,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequest("The data is invalid"));
      }
      if (err.code === 11000) {
        next(new Conflict("Duplicate key error"));
      } else {
        return next(err);
      }
    });
};

// Get
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(Request_Successful).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFound("Not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequest("The data is invalid"));
      } else {
        return next(err);
      }
    });
};

// Login
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    next(new BadRequest("The email field is required"));
  }
  if (!password) {
    next(new BadRequest("The password field is required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        next(new UnAuthorized("Incorrect email or password"));
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(Request_Successful).res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UnAuthorized("Incorrect email or password"));
      } else {
        return next(err);
      }
    });
};

module.exports = {
  createUser,
  getUser,
  loginUser,
};
