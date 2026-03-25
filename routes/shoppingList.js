const express = require("express");
const router = express.Router();
const shoppingListController = require("../controllers/shoppingListController");

// Get shopping list
router.get("/", shoppingListController.getShoppingList);

// Add item to shopping list
router.post("/", shoppingListController.addItem);

// Toggle checked state of an item
router.patch("/:id", shoppingListController.toggleChecked);

// Delete item from shopping list
router.delete("/:id", shoppingListController.deleteItem);

module.exports = router;
