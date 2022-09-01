const { Truck } = require("../models/Truck.js");
const moment = require("moment");

class TruckService {
  async showTrucks() {
    try {
      return await Truck.find({}, "-__v");
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async addTruck(data, userId, type) {
    try {
      let width = data.dimensions.width;
      let height = data.dimensions.height;
      let length = data.dimensions.length;
      const truck = new Truck({
        created_by: userId,
        assigned_to: null,
        type: type,
        status: "IS",
        dimensions: {
          width,
          height,
          length,
        },
        payload: data.payload,
        created_date: moment().format(),
      });
      return await truck.save();
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async showTruckById(truckId) {
    try {
      return await Truck.findOne({ _id: truckId }, "-__v");
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async updateTruck(truckId, data, newType) {
    try {
      let width = data.dimensions.width;
      let height = data.dimensions.height;
      let length = data.dimensions.length;
      return Truck.findByIdAndUpdate(truckId, {
        $set: {
          type: newType,
          dimensions: {
            width,
            height,
            length,
          },
          payload: data.payload,
        },
      });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async deleteTruck(truckId) {
    try {
      return await Truck.findByIdAndDelete(truckId);
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async assignTruck(truckId, userId) {
    try {
      return Truck.findByIdAndUpdate(truckId, {
        $set: { assigned_to: userId },
      });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }

  async getAssignedTrucks() {
    return await Truck.aggregate([
      {
        $match: {
          status: "IS",
          assigned_to: {
            $ne: null,
          },
        },
      },
    ]);
  }

  async getTruckParams(truckId) {
    const { payload, dimensions } = await Truck.findById(truckId);
    return { payload, dimensions };
  }
  async setSpecsByType(type) {
    let specs = {
      dimensions: { width: null, height: null, length: null },
      payload: null,
    };
    if (type == "SPRINTER") {
      (specs.dimensions.width = 300),
        (specs.dimensions.height = 250),
        (specs.dimensions.length = 170),
        (specs.payload = 1700);
    } else if (type == " SMALL STRAIGHT") {
      (specs.dimensions.width = 500),
        (specs.dimensions.height = 250),
        (specs.dimensions.length = 170),
        (specs.payload = 2500);
    } else {
      (specs.dimensions.width = 700),
        (specs.dimensions.height = 350),
        (specs.dimensions.length = 200),
        (specs.payload = 4000);
    }
    return specs;
  }
}

module.exports = new TruckService();
