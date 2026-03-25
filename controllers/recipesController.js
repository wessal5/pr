const pool = require("../config/db");
const viewedController = require("./viewedController");

const recipesController = {
  // Create recipe
  createRecipe: async (req, res) => {
    const { name, ingredients } = req.body;

    if (!name || !ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ success: false, error: "Missing required fields or invalid format" });
    }

    try {
      const [result] = await pool.query(
        "INSERT INTO recipes (name, ingredients) VALUES (?, ?)",
        [name, JSON.stringify(ingredients)]
      );
      res.status(201).json({
        success: true,
        data: { id: result.insertId, name, ingredients }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Get all recipes
  getAllRecipes: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM recipes");
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Get recipe by ID and log view
  getRecipeById: async (req, res) => {
    const { id } = req.params;

    try {
      const [rows] = await pool.query("SELECT * FROM recipes WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Recipe not found" });
      }

      const recipe = rows[0];

      // Auto-log view (silently)
      await viewedController.logView(recipe.name);

      res.status(200).json({ success: true, data: recipe });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
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
        const recipeIngredients = recipe.ingredients;
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

      res.status(200).json({
        success: true,
        data: { canMake, cannotMake }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = recipesController;
