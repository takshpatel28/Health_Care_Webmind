const express = require("express");
const { GETDOCTORS, UpdateDoctors, InsertDoctor, DeleteDoctors } = require("../Controllers/trusty.Controller");
const TrustyRouter = express.Router();

TrustyRouter.get("/trusty/getdoctors", GETDOCTORS);
TrustyRouter.put("/trusty/updatedoctor/:id", UpdateDoctors)
// TrustyRouter.post("/trusty/insertdoctor", InsertDoctor)
TrustyRouter.delete("/trusty/deletedoctor/:id", DeleteDoctors)

module.exports = TrustyRouter;