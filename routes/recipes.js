const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipesController");

// Create recipe
router.post("/", recipesController.createRecipe);

// Get all recipes
router.get("/", recipesController.getAllRecipes);

// Get single recipe (with auto-logging)
router.get("/:id", recipesController.getRecipeById);

// Recipe suggestion engine
router.get("/suggestions", recipesController.getSuggestions);

module.exports = router;
