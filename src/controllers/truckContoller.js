const TruckService = require("../services/truckService");
const { truckJoiShema } = require("../models/Truck");

class TruckController {
  async showTrucks(req, res, next) {
    try {
      const trucksData = await TruckService.showTrucks();
      return await res.status(200).json({ trucks: trucksData });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async addTruck(req, res, next) {
    try {
      const type = req.body.type;
      const data = await TruckService.setSpecsByType(type);
      await truckJoiShema.extract("type").validateAsync(type);
      await truckJoiShema.extract("dimensions").validateAsync(data.dimensions);
      await truckJoiShema.extract("payload").validateAsync(data.payload);
      const userData = await TruckService.addTruck(data, userId, type);
      return await res.json(userData);
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async showTruckById(req, res, next) {
    try {
      const truckId = req.params.id;
      const trucksData = await TruckService.showTruckById(truckId);
      return await res.status(200).json({ truck: trucksData });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async updateTruck(req, res, next) {
    try {
      const newType = req.body.type;
      const truckId = req.params.id;
      const data = await TruckService.setSpecsByType(newType);
      await truckJoiShema.extract("type").validateAsync(newType);
      await truckJoiShema.extract("dimensions").validateAsync(data.dimensions);
      await truckJoiShema.extract("payload").validateAsync(data.payload);
      await TruckService.updateTruck(truckId, data, newType);
      return res.status(200).json({ message: "Truck updated successfully" });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async deleteTruck(req, res, next) {
    try {
      const truckId = req.params.id;
      await TruckService.deleteTruck(truckId);
      return res.status(200).json({ message: "Truck deleted successfully" });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async assignTruck(req, res, next) {
    try {
      const userId = req.user.userId;
      const truckId = req.params.id;
      await TruckService.assignTruck(truckId, userId);
      return res.status(200).json({ message: "Truck assigned successfully" });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
}

module.exports = new TruckController();
