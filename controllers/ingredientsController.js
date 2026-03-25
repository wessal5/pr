const pool = require("../config/db");

const ingredientsController = {
  // Add ingredient
  addIngredient: async (req, res) => {
    const { name, quantity, expiry_date, category } = req.body;

    if (!name || quantity === undefined || !expiry_date) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    try {
      const [result] = await pool.query(
        "INSERT INTO ingredients (name, quantity, expiry_date, category) VALUES (?, ?, ?, ?)",
        [name, quantity, expiry_date, category]
      );
      res.status(201).json({
        success: true,
        data: { id: result.insertId, name, quantity, expiry_date, category }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Get all ingredients with dynamic status calculation and sorting
  getAllIngredients: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM ingredients");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const enrichedIngredients = rows.map((ingredient) => {
        const expiryDate = new Date(ingredient.expiry_date);
        expiryDate.setHours(0, 0, 0, 0);

        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status;
        if (diffDays < 0) {
          status = "expired";
        } else if (diffDays <= 1) {
          status = "critical_soon";
        } else if (diffDays <= 3) {
          status = "soon";
        } else {
          status = "normal";
        }

        return { ...ingredient, status };
      });

      // Sorting logic based on priority:
      const priority = {
        expired: 1,
        critical_soon: 2,
        soon: 3,
        normal: 4,
      };

      enrichedIngredients.sort((a, b) => priority[a.status] - priority[b.status]);

      res.status(200).json({ success: true, data: enrichedIngredients });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Update ingredient
  updateIngredient: async (req, res) => {
    const { id } = req.params;
    const { name, quantity, expiry_date, category } = req.body;

    try {
      const [result] = await pool.query(
        "UPDATE ingredients SET name = ?, quantity = ?, expiry_date = ?, category = ? WHERE id = ?",
        [name, quantity, expiry_date, category, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: "Ingredient not found" });
      }

      res.status(200).json({
        success: true,
        data: { id, name, quantity, expiry_date, category }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Delete ingredient
  deleteIngredient: async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await pool.query("DELETE FROM ingredients WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: "Ingredient not found" });
      }

      res.status(200).json({ success: true, data: { message: "Ingredient deleted successfully" } });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = ingredientsController;
