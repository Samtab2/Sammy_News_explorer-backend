const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateNewsBody = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().messages({
      "string.empty": "The keyword field is required",
    }),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateUrl).messages({
      "string.empty": "The link field must be filled in",
      "string.url": "The link field must be a valid URL",
    }),
    imageUrl: Joi.string().required().custom(validateUrl),
  }),
});

module.exports.validateSignUpBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the name field is 2",
      "string.max": "The maximum length of the name field is 30",
      "string.empty": "The name field must be filled in",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The email field must be filled in",
      "string.email": "The email field must be a valid email",
    }),
    password: Joi.string().required().min().messages({
      "string.empty": "The password field must be filled in",
    }),
  }),
});

module.exports.validateLogInBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "The email field must be a valid email",
      "string.empty": "The email field must be filled in",
    }),
    password: Joi.string().required().min().messages({
      "string.empty": "The password field is required",
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24).message(),
  }),
});
