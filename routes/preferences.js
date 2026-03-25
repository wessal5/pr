const express = require("express");
const router = express.Router();
const preferencesController = require("../controllers/preferencesController");

// Add preference
router.post("/", preferencesController.addPreference);

// Get all preferences
router.get("/", preferencesController.getPreferences);

// Delete preference
router.delete("/:id", preferencesController.deletePreference);

module.exports = router;
