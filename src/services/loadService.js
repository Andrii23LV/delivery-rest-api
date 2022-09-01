const { Truck } = require("../models/Truck.js");
const moment = require("moment");
const bcryptjs = require("bcryptjs");
const { loadJoiShema, Load } = require("../models/Load.js");
var ObjectId = require("mongodb").ObjectId;

class LoadService {
  async showLoads(status) {
    try {
      return await Load.find(
        {
          status: status,
        },
        "-__v"
      );
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }

  async addLoad(req) {
    console.log(req);
    await loadJoiShema.validateAsync({
      created_by: req.user.userId,
      ...req.body,
    });
    try {
      const load = new Load({
        created_by: req.user.userId,
        name: req.body.name,
        payload: req.body.payload,
        pickup_address: req.body.pickup_address,
        delivery_address: req.body.delivery_address,
        dimensions: {
          width: req.body.dimensions.width,
          length: req.body.dimensions.length,
          height: req.body.dimensions.height,
        },
        created_date: moment().format(),
      });
      return await load.save();
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async showActiveLoads(userId) {
    try {
      return await Load.findOne(
        {
          assigned_to: userId,
          status: "ASSIGNED",
        },
        "-__v"
      );
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async showLoadById(loadId) {
    try {
      return await Load.findById(loadId, "-__v");
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async updateLoad(loadId, data) {
    try {
      return await Load.findByIdAndUpdate(loadId, data);
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async iterateNextLoad(driverId) {
    try {
      const load = await Load.find({ assigned_to: driverId });
      if (load[0].status === "SHIPPED") throw new Error("Already shipped");
      if (load[0].state === "En route to Pick Up") {
        return await Load.findOneAndUpdate(
          { assigned_to: driverId },
          {
            state: "Arrived to Pick Up",
          }
        );
      } else if (load[0].state === "Arrived to Pick Up") {
        return await Load.findOneAndUpdate(
          { assigned_to: driverId },
          {
            state: "En route to Delivery",
          }
        );
      } else if (load[0].state === "En route to Delivery") {
        await Truck.findOneAndUpdate(
          { assigned_to: driverId },
          {
            status: "IS",
          }
        );
        return await Load.findOneAndUpdate(
          { assigned_to: driverId },
          {
            state: "Arrived to Delivery",
            status: "SHIPPED",
          }
        );
      }
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async deleteLoad(loadId) {
    try {
      return await Load.findByIdAndDelete(loadId);
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async postLoadById(req, res, next) {
    try {
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
  async getLoadInfoById(loadId) {
    const load = await Load.aggregate([
      {
        $match: {
          _id: ObjectId(loadId),
          status: "ASSIGNED",
        },
      },
    ]);
    const truck = await Truck.aggregate([
      {
        $match: {
          assigned_to: load[0].assigned_to,
          status: "IS",
        },
      },
    ]);
    return { load, truck };
  }

  async updateUserLoadStatus(loadId, status) {
    return await Load.findByIdAndUpdate(loadId, { status: status });
  }

  async assignTruckToLoad(loadId, truckId, driverId) {
    await Truck.findByIdAndUpdate(truckId, { status: "OL" });

    return await Load.findByIdAndUpdate(loadId, {
      assigned_to: driverId,
      $set: { state: "En route to Pick Up" },
      $push: {
        logs: {
          message: `Load assigned to driver with id ${driverId}`,
          time: moment().format(),
        },
      },
    });
  }

  async getLoadParams(loadId) {
    const { payload, dimensions } = await Load.findById(loadId);
    return { payload, dimensions };
  }

  async compareParams(truckParams, loadParams) {
    await truckJoiSchema.extract(["email"]).validateAsync(loadParams.payload);
    await loadJoiSchema.extract(["email"]).validateAsync(truckParams.payload);
    if (loadParams.payload > truckParams.payload) {
      throw Error("The load dimensions are larger than the truck capacity");
    }

    if (loadParams.dimensions.width > truckParams.dimensions.width) {
      throw Error("The load dimensions are larger than the truck capacity");
    }

    if (loadParams.dimensions.height > truckParams.dimensions.height) {
      throw Error("The load dimensions are larger than the truck capacity");
    }

    if (loadParams.dimensions.length > truckParams.dimensions.length) {
      throw Error("The load dimensions are larger than the truck capacity");
    }
  }
}

module.exports = new LoadService();
