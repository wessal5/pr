const pool = require("../config/db");

const viewedController = {
  // Add recipe view log manually
  addViewed: async (req, res) => {
    const { recipe_name } = req.body;

    if (!recipe_name) {
      return res.status(400).json({ error: "Missing recipe_name" });
    }

    try {
      await pool.query("INSERT INTO viewed_recipes (recipe_name) VALUES (?)", [recipe_name]);
      res.status(201).json({ message: "View recorded" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get viewed history ordered by newest first
  getViewedHistory: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM viewed_recipes ORDER BY viewed_at DESC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Helper method for automatic logging from other controllers
  logView: async (recipe_name) => {
    try {
      await pool.query("INSERT INTO viewed_recipes (recipe_name) VALUES (?)", [recipe_name]);
      console.log(`Auto-logged view for recipe: ${recipe_name}`);
    } catch (err) {
      console.error(`Failed to auto-log view for recipe: ${recipe_name}`, err.message);
    }
  },
};

module.exports = viewedController;
