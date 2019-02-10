const express = require('express');
const router = express.Router();
const app = require("../app");
const views = require("./views");
const models = require("../models");

router.get("/:personId/mailAddress", views.listEmails);
router.post("/:personId/mailAddress", views.addNewEmail);
router.get("/:personId/mailAddress/:mailAddress", views.getEmail);
router.put("/:personId/mailAddress/:mailAddress", views.updateEmail);
router.delete("/:personId/mailAddress/:mailAddress", views.deleteEmail);

module.exports = router;
