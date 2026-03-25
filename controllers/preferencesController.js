const pool = require("../config/db");

const preferencesController = {
  // Add preference
  addPreference: async (req, res) => {
    const { ingredient_name } = req.body;

    if (!ingredient_name) {
      return res.status(400).json({ error: "Missing ingredient_name" });
    }

    try {
      // Check for duplication (case-insensitive)
      const [existing] = await pool.query(
        "SELECT id FROM preferences WHERE LOWER(ingredient_name) = LOWER(?)",
        [ingredient_name]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: "Ingredient already in preferences" });
      }

      const [result] = await pool.query(
        "INSERT INTO preferences (ingredient_name) VALUES (?)",
        [ingredient_name]
      );

      res.status(201).json({ id: result.insertId, ingredient_name });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all preferences
  getPreferences: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM preferences");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete preference
  deletePreference: async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await pool.query("DELETE FROM preferences WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Preference not found" });
      }

      res.json({ message: "Preference deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Stock monitoring logic
  checkStockLogic: async (req, res, next) => {
    try {
      // Rule 1: Identify preferred ingredients with quantity = 0
      // We join preferences with ingredients to see which ones have quantity 0
      const [outOfStock] = await pool.query(`
        SELECT p.ingredient_name
        FROM preferences p
        JOIN ingredients i ON LOWER(p.ingredient_name) = LOWER(i.name)
        WHERE i.quantity = 0
      `);

      for (const item of outOfStock) {
        const name = item.ingredient_name;

        // Rule 1: Automatically add to shopping_list as "essential", avoid duplicates
        const [existing] = await pool.query(
          "SELECT id FROM shopping_list WHERE LOWER(name) = LOWER(?) AND type = 'essential'",
          [name]
        );

        if (existing.length === 0) {
          await pool.query(
            "INSERT INTO shopping_list (name, type) VALUES (?, 'essential')",
            [name]
          );
          console.log(`Auto-added ${name} to shopping list (essential)`);
        }
      }

      if (next) next();
    } catch (err) {
      console.error("Stock monitoring error:", err.message);
      if (next) next();
    }
  },
};

module.exports = preferencesController;
