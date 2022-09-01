const mongoose = require("mongoose");

const Joi = require("joi");

const userJoiSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  role: Joi.string().pattern(new RegExp("^SHIPPER|DRIVER$")).required(),
});

const User = mongoose.model("User", {
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_date: {
    type: String,
    required: true,
  },
});

module.exports = {
  User,
  userJoiSchema,
};
