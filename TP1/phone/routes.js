const express = require('express');
const router = express.Router();
const app = require("../app");
const views = require("./views");
const models = require("../models");


router.get("/:personId/phones", views.listPhones);
router.post("/:personId/phones", views.addNewPhone);
router.get("/:personId/phones/:phoneId", views.getPhone);
router.put("/:personId/phones/:phoneId", views.updatePhone);
router.delete("/:personId/phones/:phoneId", views.deletePhone);

module.exports = router;
