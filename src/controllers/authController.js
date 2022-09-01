const AuthService = require("../services/authService");
const { User } = require("../models/Users.js");
// const { validationResult } = require("express-validator");
const { userJoiSchema } = require("../models/Users");
const generator = require("generate-password");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  async registration(req, res, next) {
    try {
      const { email, password, role } = req.body;
      await userJoiSchema.extract(["email"]).validateAsync(email);
      await userJoiSchema.extract(["password"]).validateAsync(password);
      await userJoiSchema.extract(["role"]).validateAsync(role);
      const userData = await AuthService.registration(email, password, role);
      return await res.json(userData);
    } catch (err) {
      console.log(err.message);
    }
  }
  async login(req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    await userJoiSchema.extract(["email"]).validateAsync(req.body.email);
    if (
      user &&
      (await bcryptjs.compare(String(req.body.password), String(user.password)))
    ) {
      await userJoiSchema
        .extract(["password"])
        .validateAsync(req.body.password);
      const payload = { email: user.email, userId: user._id };
      const jwtToken = jwt.sign(payload, "secret-jwt-key");
      res.cookie("token", jwtToken, {
        httpOnly: true,
      });
      return res.status(200).json({
        jwt_token: jwtToken,
      });
    }
    return res.status(400).json({ message: "Not authorized" });
  }

  async forgotPassword(req, res, next) {
    try {
      const email = req.body.email;
      await userJoiSchema.extract(["email"]).validateAsync(email);
      const newPassword = generator.generate({
        length: 12,
        numbers: true,
      });
      await AuthService.forgotPassword(email, newPassword);
      res
        .status(200)
        .send({ message: "New password sent to your email address" });
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = new AuthController();
