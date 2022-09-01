const { User } = require("../models/Users.js");

const getUser = (req, res, next) => {
  try {
    return User.find({ _id: req.user.userId }).then((result) => {
      res.status(200).json({ user: result });
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

const deleteUser = (req, res, next) => {
  try {
    return User.deleteOne({ _id: req.params.id }).then((result) => {
      res.status(200).send({ message: "Profile deleted successfully" });
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

const updateUserPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  try {
    return User.findByIdAndUpdate(req.user.userId, {
      password: await bcrypt.hash(newPassword, 10),
    }).then((result) => {
      res.status(200).send({ message: "Password changed successfully" });
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getUser,
  deleteUser,
  updateUserPassword,
};
