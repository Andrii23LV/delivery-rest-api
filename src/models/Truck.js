const mongoose = require("mongoose");
const Joi = require("joi");

const truckJoiShema = Joi.object({
  type: Joi.string()
    .pattern(new RegExp("^SPRINTER|SMALL\\sSTRAIGHT|LARGE\\sSTRAIGHT$"))
    .required(),
  payload: Joi.number(),
  dimensions: Joi.object({
    width: Joi.number(),
    height: Joi.number(),
    length: Joi.number(),
  }),
  status: Joi.string().pattern(new RegExp("^OL|IS$")),
});

const Truck = mongoose.model("Truck", {
  created_by: {
    type: String,
    required: true,
    unique: false,
  },
  assigned_to: {
    type: String,
  },
  type: {
    type: String,
  },
  status: {
    type: String,
    default: "IS",
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
  payload: {
    type: Number,
    required: true,
  },
  created_date: {
    type: String,
    required: true,
  },
});

module.exports = {
  Truck,
  truckJoiShema,
};
