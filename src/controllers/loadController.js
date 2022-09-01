const LoadService = require("../services/loadService");
const TruckService = require("../services/TruckService");
const { Load, loadJoiShema } = require("../models/Load");

class LoadController {
  async showLoads(req, res, next) {
    try {
      const status = req.query.status;
      const offset = req.query.offset;
      const limit = req.query.limit;
      const loadsData = await LoadService.showLoads(status);
      return await res.status(200).json({
        loads: loadsData.slice(offset, limit || loadsData.length),
      });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }

  async addLoad(req, res, next) {
    try {
      await loadJoiShema.extract("name").validateAsync(req.body.name);
      await loadJoiShema
        .extract("dimensions")
        .validateAsync(req.body.dimensions);
      await loadJoiShema.extract("payload").validateAsync(req.body.payload);
      await loadJoiShema
        .extract("pickup_address")
        .validateAsync(req.body.pickup_address);
      await loadJoiShema
        .extract("delivery_address")
        .validateAsync(req.body.delivery_address);
      await LoadService.addLoad(req);
      return await res.json({ message: "Load created successfully" });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }

  async showActiveLoads(req, res) {
    try {
      const userId = req.user.userId;
      const load = await LoadService.showActiveLoads(userId);
      if (!load) {
        throw Error("No active load");
      }
      return res.status(200).json({ load });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }

  async showLoadById(req, res, next) {
    try {
      const loadId = req.params.id;
      const loadData = await LoadService.showLoadById(loadId);
      return await res.status(200).json({ load: loadData });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }

  async updateLoad(req, res, next) {
    try {
      await loadJoiShema.validateAsync(req.body);
      const loadId = req.params.id;
      const data = req.body;
      await LoadService.updateLoad(loadId, data);
      return res.status(200).json({ message: "Load updated successfully" });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }

  async iterateNextLoad(req, res, next) {
    try {
      const driverId = req.user.userId;
      const data = await LoadService.iterateNextLoad(driverId);
      return res
        .status(200)
        .json({ message: `Load state changed to '${data.state}'` });
    } catch (err) {
      return res.status(400).send({
        message: "Load is shipped",
      });
    }
  }

  async deleteLoad(req, res, next) {
    try {
      const loadId = req.params.id;
      await LoadService.deleteLoad(loadId);
      return res.status(200).json({ message: "Load deleted successfully" });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }

  async postLoadById(req, res, next) {
    try {
      const loadId = req.params.id;
      const load = await LoadService.updateUserLoadStatus(loadId, "POSTED");
      if (!load) {
        throw Error("Load not found");
      }
      const assignedTrucks = await TruckService.getAssignedTrucks();
      if (!assignedTrucks.length) {
        await LoadService.updateUserLoadStatus(loadId, "NEW");
        throw Error("No available trucks found");
      }
      const truckId = assignedTrucks[0]._id;
      const driverId = assignedTrucks[0].assigned_to;
      await LoadService.assignTruckToLoad(loadId, truckId, driverId);

      await LoadService.updateUserLoadStatus(loadId, "ASSIGNED");
      const loadParams = await LoadService.getLoadParams(loadId);
      const truckParams = await TruckService.getTruckParams(truckId);

      LoadService.compareParams(truckParams, loadParams);

      return res.status(200).json({
        message: "Load posted successfully",
        driver_found: true,
      });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }

  async getLoadInfoById(req, res, next) {
    try {
      const loadId = req.params.id;
      const userId = req.user.id;
      const load = await LoadService.getLoadInfoById(userId, loadId);
      if (!load) {
        throw Error("Load not found");
      }
      return res.status(200).json(load);
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
}

module.exports = new LoadController();
