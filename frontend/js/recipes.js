document.addEventListener("DOMContentLoaded", () => {
  ui.renderNavbar("recipes");
  loadRecipes();

  const form = document.getElementById("recipe-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("recipe-name").value;
    const ingredients = document.getElementById("recipe-ingredients").value.split(',').map(s => s.trim());

    try {
      await api.addRecipe({ name, ingredients });
      ui.showAlert("Recipe saved!");
      form.reset();
      loadRecipes();
    } catch (err) {
      ui.showAlert(err.message, "danger");
    }
  });

  document.getElementById("btn-suggestions").addEventListener("click", loadSuggestions);
});

async function loadRecipes() {
  ui.showLoading("recipes-list");
  try {
    const result = await api.getRecipes();
    const list = document.getElementById("recipes-list");

    if (result.data.length === 0) {
      list.innerHTML = "<p>No recipes saved yet.</p>";
      return;
    }

    list.innerHTML = result.data.map(recipe => `
      <div class="card">
        <h4>${recipe.name}</h4>
        <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
        <button class="btn btn-primary" onclick="viewRecipe(${recipe.id})">View Details</button>
      </div>
    `).join("");
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}

async function viewRecipe(id) {
  try {
    const result = await api.getRecipeById(id);
    const recipe = result.data;
    alert(`Recipe: ${recipe.name}\nIngredients: ${recipe.ingredients.join(', ')}`);
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}

async function loadSuggestions() {
  const resultArea = document.getElementById("suggestions-result");
  resultArea.style.display = "block";
  ui.showLoading("can-make-list");
  ui.showLoading("cannot-make-list");

  try {
    const result = await api.getSuggestions();
    const { canMake, cannotMake } = result.data;

    const canList = document.getElementById("can-make-list");
    canList.innerHTML = canMake.length > 0 ? canMake.map(r => `<li>${r.recipe}</li>`).join('') : "<p>Nothing can be made.</p>";

    const cannotList = document.getElementById("cannot-make-list");
    cannotList.innerHTML = cannotMake.length > 0 ? cannotMake.map(r => `
      <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
        <strong>${r.recipe}</strong>
        <p style="color: var(--danger); font-size: 0.9rem;">Missing: ${r.missing.join(', ')}</p>
        <button class="btn btn-primary btn-sm" onclick="addToShoppingList('${r.missing.join(',')}')">Add Missing to List</button>
      </div>
    `).join('') : "<p>No recipes with missing items.</p>";
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}

async function addToShoppingList(missingStr) {
  const missing = missingStr.split(',');
  try {
    for (const item of missing) {
      await api.addShoppingListItem({ name: item, type: "optional" });
    }
    ui.showAlert("All missing items added to Shopping List!");
  } catch (err) {
    ui.showAlert("Some items were already in list.", "warning");
  }
}
