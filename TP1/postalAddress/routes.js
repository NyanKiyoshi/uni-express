const express = require('express');
const views = require("./views");
const router = express.Router();

router.get("/:personId/postalAddresses", views.listPostalAddresses);
router.post("/:personId/postalAddresses", views.addNewPostalAddress);
router.get("/:personId/postalAddresses/:postalId", views.getPostalAddress);
router.put("/:personId/postalAddresses/:postalId", views.updatePostalAddress);
router.delete("/:personId/postalAddresses/:postalId", views.deletePostalAddress);

module.exports = router;
