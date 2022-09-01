const jwt = require("jsonwebtoken");
const { User } = require("../models/Users.js");

class Middleware {
  async authMiddleware(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(401)
        .json({ message: "Please, provide authorization header" });
    }

    const [, token] = authorization.split(" ");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Please, include token to request" });
    }

    try {
      const tokenPayload = jwt.verify(token, "secret-jwt-key");
      req.user = {
        userId: tokenPayload.userId,
        email: tokenPayload.email,
      };
      next();
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  }

  async driverMiddleware(req, res, next) {
    try {
      const driver = await User.find({ _id: req.user.userId });
      console.log(driver[0].role);
      if (driver[0].role !== "DRIVER") {
        return res.status(401).json({ message: "Incorrect role" });
      }
      next();
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
  async shipperMiddleware(req, res, next) {
    try {
      const driver = await User.find({ _id: req.user.userId });
      console.log(driver[0].role);
      if (driver[0].role !== "SHIPPER") {
        return res.status(401).json({ message: "Incorrect role" });
      }
      next();
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new Middleware();
