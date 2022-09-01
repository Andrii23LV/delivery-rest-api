const express = require("express");
const router = express.Router();
const TruckContoller = require("../controllers/truckContoller");

const Middleware = require("../middleware/middleware.js");

router.get(
  "/",
  [Middleware.authMiddleware, Middleware.driverMiddleware],
  TruckContoller.showTrucks
);
router.post(
  "/",
  [Middleware.authMiddleware, Middleware.driverMiddleware],
  TruckContoller.addTruck
);
router.get(
  "/:id",
  [Middleware.authMiddleware, Middleware.driverMiddleware],
  TruckContoller.showTruckById
);
router.put(
  "/:id",
  [Middleware.authMiddleware, Middleware.driverMiddleware],
  TruckContoller.updateTruck
);
router.delete(
  "/:id",
  [Middleware.authMiddleware, Middleware.driverMiddleware],
  TruckContoller.deleteTruck
);
router.post(
  "/:id/assign",
  [Middleware.authMiddleware, Middleware.driverMiddleware],
  TruckContoller.assignTruck
);

module.exports = {
  truckRouter: router,
};
