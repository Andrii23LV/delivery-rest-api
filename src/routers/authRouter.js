const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const { asyncWrapper } = require("../asyncWrapper");

// const asyncWrapper = (controller) => {
//   return (req, res, next) => controller(req, res, next).catch(next);
// };

router.post("/register", asyncWrapper(AuthController.registration));

router.post("/login", asyncWrapper(AuthController.login));

router.post(
  "/forgot_password",

  AuthController.forgotPassword
);

module.exports = {
  authRouter: router,
};
