const { User } = require("../models/Users");
const moment = require("moment");
const bcryptjs = require("bcryptjs");
const mailService = require("../services/mailService");

class AuthService {
  async registration(email, password, role) {
    const user = new User({
      email,
      password: await bcryptjs.hash(password, 10),
      role,
      created_date: moment().format(),
    });
    return await user.save();
  }

  async forgotPassword(email, newPassword) {
    try {
      await User.findOneAndUpdate(email, {
        password: await bcryptjs.hash(newPassword, 10),
      });
      await mailService.sendPasswordMail(email, newPassword);
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = new AuthService();
