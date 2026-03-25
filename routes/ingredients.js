const express = require("express");
const router = express.Router();
const ingredientsController = require("../controllers/ingredientsController");

// Add ingredient
router.post("/", ingredientsController.addIngredient);

// Get all ingredients
router.get("/", ingredientsController.getAllIngredients);

// Update ingredient
router.put("/:id", ingredientsController.updateIngredient);

// Delete ingredient
router.delete("/:id", ingredientsController.deleteIngredient);

module.exports = router;
