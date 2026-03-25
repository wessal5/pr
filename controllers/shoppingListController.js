const pool = require("../config/db");

const shoppingListController = {
  // Get all shopping list items grouped by type
  getShoppingList: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM shopping_list");

      const grouped = {
        essential: rows.filter((item) => item.type === "essential"),
        optional: rows.filter((item) => item.type === "optional"),
      };

      res.json(grouped);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Add item to shopping list with duplication check (case-insensitive)
  addItem: async (req, res) => {
    const { name, type } = req.body;

    if (!name || !type || !["essential", "optional"].includes(type)) {
      return res.status(400).json({ error: "Missing required fields or invalid type" });
    }

    try {
      // Check for duplication (case-insensitive name AND type)
      const [existing] = await pool.query(
        "SELECT id FROM shopping_list WHERE LOWER(name) = LOWER(?) AND type = ?",
        [name, type]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: "Item already exists in the shopping list for this type" });
      }

      const [result] = await pool.query(
        "INSERT INTO shopping_list (name, type) VALUES (?, ?)",
        [name, type]
      );

      res.status(201).json({ id: result.insertId, name, type, checked: false });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Toggle checked state of an item
  toggleChecked: async (req, res) => {
    const { id } = req.params;

    try {
      // First, get the current checked status
      const [rows] = await pool.query("SELECT checked FROM shopping_list WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      const newChecked = !rows[0].checked;

      await pool.query("UPDATE shopping_list SET checked = ? WHERE id = ?", [newChecked, id]);

      res.json({ id, checked: newChecked });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete item from shopping list
  deleteItem: async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await pool.query("DELETE FROM shopping_list WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json({ message: "Item deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = shoppingListController;
