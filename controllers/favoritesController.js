const pool = require("../config/db");

const favoritesController = {
  // Add recipe to favorites
  addFavorite: async (req, res) => {
    const { recipe_name } = req.body;

    if (!recipe_name) {
      return res.status(400).json({ success: false, error: "Missing recipe_name" });
    }

    try {
      // Check for duplication (case-insensitive)
      const [existing] = await pool.query(
        "SELECT id FROM favorites WHERE LOWER(recipe_name) = LOWER(?)",
        [recipe_name]
      );

      if (existing.length > 0) {
        return res.status(400).json({ success: false, error: "Recipe already in favorites" });
      }

      const [result] = await pool.query(
        "INSERT INTO favorites (recipe_name) VALUES (?)",
        [recipe_name]
      );

      res.status(201).json({
        success: true,
        data: { id: result.insertId, recipe_name }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Get all favorites
  getFavorites: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM favorites");
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Remove recipe from favorites
  removeFavorite: async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await pool.query("DELETE FROM favorites WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: "Favorite not found" });
      }

      res.status(200).json({ success: true, data: { message: "Recipe removed from favorites" } });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = favoritesController;
