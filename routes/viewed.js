const express = require("express");
const router = express.Router();
const viewedController = require("../controllers/viewedController");

// Add viewed recipe (manually)
router.post("/", viewedController.addViewed);

// Get viewed history
router.get("/", viewedController.getViewedHistory);

module.exports = router;
