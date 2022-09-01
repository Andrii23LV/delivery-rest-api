const mongoose = require("mongoose");
const Joi = require("joi");

const loadJoiShema = Joi.object({
  created_by: Joi.string(),
  assigned_to: Joi.string(),
  status: Joi.string().pattern(new RegExp("^NEW|POSTED|ASSIGNED|SHIPPED$")),
  state: Joi.string().pattern(
    new RegExp(
      "^En\\sroute\\sto\\sPick\\sUp|Arrived\\sto\\sPick\\sUp|En\\sroute\\sto\\sdelivery|Arrived\\sto\\sdelivery$"
    )
  ),
  name: Joi.string().required(),
  payload: Joi.number().required(),
  pickup_address: Joi.string().required(),
  delivery_address: Joi.string().required(),
  dimensions: Joi.object({
    width: Joi.number().required(),
    height: Joi.number().required(),
    length: Joi.number().required(),
  }),
  logs: Joi.array().items(
    Joi.object({
      message: Joi.string(),
      time: Joi.date(),
    })
  ),
});

const logSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});

const Load = mongoose.model("Load", {
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
    default: "NEW",
  },
  state: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  payload: {
    type: Number,
    required: true,
  },
  pickup_address: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  dimensions: {
    type: Object,
    required: true,
    properties: {
      width: { default: null, type: Number },
      length: { default: null, type: Number },
      height: { default: null, type: Number },
    },
  },
  logs: {
    type: [logSchema],
    required: false,
  },
  created_date: {
    type: Date,
    required: true,
  },
});

module.exports = {
  Load,
  loadJoiShema,
};
