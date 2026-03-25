const pool = require("../config/db");

const viewedController = {
  // Add recipe view log manually
  addViewed: async (req, res) => {
    const { recipe_name } = req.body;

    if (!recipe_name) {
      return res.status(400).json({ success: false, error: "Missing recipe_name" });
    }

    try {
      await pool.query("INSERT INTO viewed_recipes (recipe_name) VALUES (?)", [recipe_name]);
      res.status(201).json({ success: true, data: { message: "View recorded" } });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Get viewed history ordered by newest first
  getViewedHistory: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM viewed_recipes ORDER BY viewed_at DESC");
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Helper method for automatic logging from other controllers
  logView: async (recipe_name) => {
    try {
      await pool.query("INSERT INTO viewed_recipes (recipe_name) VALUES (?)", [recipe_name]);
    } catch (err) {
      // Internal logging failure should not break the main request
    }
  },
};

module.exports = viewedController;
