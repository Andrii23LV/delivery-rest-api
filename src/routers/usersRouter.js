const express = require("express");
const Middleware = require("../middleware/Middleware");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const {
  getUser,
  deleteUser,
  updateUserPassword,
} = require("../services/usersService.js");

router.get("/me", Middleware.authMiddleware, getUser);

router.delete("/me", deleteUser);

router.patch("/me/password", Middleware.authMiddleware, updateUserPassword);

module.exports = {
  usersRouter: router,
};
