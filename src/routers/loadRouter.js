const express = require("express");
const router = express.Router();
const LoadContoller = require("../controllers/loadController");

const Middleware = require("../middleware/middleware.js");

router.get("/", [Middleware.authMiddleware], LoadContoller.showLoads);
router.post(
  "/",
  [Middleware.authMiddleware, Middleware.shipperMiddleware],
  LoadContoller.addLoad
);
router.get(
  "/active",
  [Middleware.authMiddleware, Middleware.driverMiddleware],
  LoadContoller.showActiveLoads
);
router.patch(
  "/active/state",
  [Middleware.authMiddleware, Middleware.driverMiddleware],
  LoadContoller.iterateNextLoad
);
router.get("/:id", Middleware.authMiddleware, LoadContoller.showLoadById);
router.put(
  "/:id",
  [Middleware.authMiddleware, Middleware.shipperMiddleware],
  LoadContoller.updateLoad
);
router.delete(
  "/:id",
  [Middleware.authMiddleware, Middleware.shipperMiddleware],
  LoadContoller.deleteLoad
);
router.post(
  "/:id/post",
  [Middleware.authMiddleware, Middleware.shipperMiddleware],
  LoadContoller.postLoadById
);
router.get(
  "/:id/shipping_info",
  [Middleware.authMiddleware, Middleware.shipperMiddleware],
  LoadContoller.getLoadInfoById
);

module.exports = {
  loadRouter: router,
};
