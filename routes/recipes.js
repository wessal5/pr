const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipesController");

// Create recipe
router.post("/", recipesController.createRecipe);

// Get all recipes
router.get("/", recipesController.getAllRecipes);

// Recipe suggestion engine
router.get("/suggestions", recipesController.getSuggestions);

module.exports = router;
