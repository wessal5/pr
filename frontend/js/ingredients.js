document.addEventListener("DOMContentLoaded", () => {
  ui.renderNavbar("ingredients");
  loadIngredients();

  const form = document.getElementById("ingredient-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("name").value,
      quantity: parseInt(document.getElementById("quantity").value),
      expiry_date: document.getElementById("expiry_date").value,
      category: document.getElementById("category").value,
    };

    try {
      await api.addIngredient(data);
      ui.showAlert("Ingredient added successfully!");
      form.reset();
      loadIngredients();
    } catch (err) {
      ui.showAlert(err.message, "danger");
    }
  });
});

async function loadIngredients() {
  ui.showLoading("ingredients-list");
  try {
    const result = await api.getIngredients();
    const list = document.getElementById("ingredients-list");

    if (result.data.length === 0) {
      list.innerHTML = "<p>No ingredients in stock.</p>";
      return;
    }

    list.innerHTML = result.data.map(item => `
      <div class="card">
        <h4>${item.name}</h4>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Expiry:</strong> ${new Date(item.expiry_date).toLocaleDateString()}</p>
        <p><strong>Category:</strong> ${item.category || "N/A"}</p>
        <p><strong>Status:</strong> <span class="status-${item.status.split('_')[0]}">${item.status.replace('_', ' ')}</span></p>
        <div style="margin-top: 10px;">
          <button class="btn btn-danger btn-sm" onclick="deleteIngredient(${item.id})">Delete</button>
        </div>
      </div>
    `).join("");
  } catch (err) {
    document.getElementById("ingredients-list").innerHTML = `<p class="status-expired">Error: ${err.message}</p>`;
  }
}

async function deleteIngredient(id) {
  if (!confirm("Are you sure?")) return;
  try {
    await api.deleteIngredient(id);
    ui.showAlert("Ingredient deleted!");
    loadIngredients();
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}
