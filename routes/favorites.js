const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");

// Add favorite
router.post("/", favoritesController.addFavorite);

// Get all favorites
router.get("/", favoritesController.getFavorites);

// Remove favorite
router.delete("/:id", favoritesController.removeFavorite);

module.exports = router;
