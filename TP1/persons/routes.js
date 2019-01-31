const express = require('express');
const router = express.Router();
const views = require("./views");

router.get("/", views.index);
router.post("/", views.createPerson);
router.get("/:personId", views.getPerson);
router.put("/:personId", views.updatePerson);
router.delete("/:personId", views.deletePerson);

module.exports = router;
