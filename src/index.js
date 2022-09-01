const express = require("express");
const morgan = require("morgan");
const cookiePasrer = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { authRouter } = require("./routers/authRouter.js");
const { usersRouter } = require("./routers/usersRouter.js");
const { truckRouter } = require("./routers/truckRouter.js");
const { loadRouter } = require("./routers/loadRouter.js");
const bcryptjs = require("bcryptjs");

mongoose.connect(
  "mongodb+srv://NodeHWsAT:guess-password-23@clusterat.xqs4gdm.mongodb.net/?retryWrites=true&w=majority"
);
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cookiePasrer());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST", "PUT", "GET", "DELETE", "PATCH"],
  })
);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/trucks", truckRouter);
app.use("/api/loads", loadRouter);

const start = async () => {
  try {
    app.listen(8080, () => console.log(`Server started on PORT 8080`));
  } catch (err) {
    console.log(err.message);
  }
};

start();

// ERROR HANDLER
app.use(errorHandler);

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send({ message: "Server error" });
}
