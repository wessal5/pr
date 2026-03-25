const pool = require("../config/db");

const recipesController = {
  // Create recipe
  createRecipe: async (req, res) => {
    const { name, ingredients } = req.body;

    if (!name || !ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Missing required fields or invalid ingredients format" });
    }

    try {
      const [result] = await pool.query(
        "INSERT INTO recipes (name, ingredients) VALUES (?, ?)",
        [name, JSON.stringify(ingredients)]
      );
      res.status(201).json({ id: result.insertId, name, ingredients });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all recipes
  getAllRecipes: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM recipes");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Recipe suggestion engine
  getSuggestions: async (req, res) => {
    try {
      // Step 1: Fetch all ingredients from stock
      const [ingredientRows] = await pool.query("SELECT name FROM ingredients");
      const inStockIngredients = new Set(ingredientRows.map((ing) => ing.name.toLowerCase()));

      // Step 2: Fetch all recipes
      const [recipeRows] = await pool.query("SELECT name, ingredients FROM recipes");

      // Step 3: Compare ingredients
      const canMake = [];
      const cannotMake = [];

      recipeRows.forEach((recipe) => {
        const recipeIngredients = recipe.ingredients; // mysql2 automatically parses JSON columns
        const missing = [];

        recipeIngredients.forEach((ing) => {
          if (!inStockIngredients.has(ing.toLowerCase())) {
            missing.push(ing);
          }
        });

        if (missing.length === 0) {
          canMake.push({ recipe: recipe.name });
        } else {
          cannotMake.push({
            recipe: recipe.name,
            missing: missing,
          });
        }
      });

      res.json({ canMake, cannotMake });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = recipesController;
