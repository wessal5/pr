require("./config/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Routes
const ingredientsRoutes = require("./routes/ingredients");
const recipesRoutes = require("./routes/recipes");
const shoppingListRoutes = require("./routes/shoppingList");
const favoritesRoutes = require("./routes/favorites");
const viewedRoutes = require("./routes/viewed");
const preferencesRoutes = require("./routes/preferences");

// Middlewares
const preferencesController = require("./controllers/preferencesController");

app.use(cors());
app.use(express.json());

// Use routes
app.use("/ingredients", preferencesController.checkStockLogic, ingredientsRoutes);
app.use("/recipes", recipesRoutes);
app.use("/shopping-list", shoppingListRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/viewed", viewedRoutes);
app.use("/preferences", preferencesRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Smart Home Ingredients API is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});