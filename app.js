require("./config/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Routes
const ingredientsRoutes = require("./routes/ingredients");
const recipesRoutes = require("./routes/recipes");

// Middlewares
app.use(cors());
app.use(express.json());

// Use routes
app.use("/ingredients", ingredientsRoutes);
app.use("/recipes", recipesRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Smart Home Ingredients API is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});