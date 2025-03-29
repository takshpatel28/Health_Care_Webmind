const express = require('express');
const TrustyRouter = express.Router();
const {
  GETDOCTORS,
  UpdateDoctors,
  DeleteDoctors,
  GET_HODS,
  UPDATE_HOD,
  DELETE_HOD
} = require('../Controllers/trusty.Controller');

// Doctors routes
TrustyRouter.get("/trusty/getdoctors", GETDOCTORS);
TrustyRouter.put("/trusty/updatedoctor/:id", UpdateDoctors);
TrustyRouter.delete("/trusty/deletedoctor/:id", DeleteDoctors);

// HOD routes
TrustyRouter.get("/trusty/gethods", GET_HODS);
TrustyRouter.put("/trusty/updatehod/:id", UPDATE_HOD);
TrustyRouter.delete("/trusty/deletehod/:id", DELETE_HOD);

module.exports = TrustyRouter;