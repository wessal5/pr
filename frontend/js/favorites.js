document.addEventListener("DOMContentLoaded", () => {
  ui.renderNavbar("favorites");
  loadFavorites();

  const form = document.getElementById("favorite-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const recipe_name = document.getElementById("recipe-name").value;

    try {
      await api.addFavorite({ recipe_name });
      ui.showAlert("Added to favorites!");
      form.reset();
      loadFavorites();
    } catch (err) {
      ui.showAlert(err.message, "danger");
    }
  });
});

async function loadFavorites() {
  ui.showLoading("favorites-list");
  try {
    const result = await api.getFavorites();
    const list = document.getElementById("favorites-list");

    if (result.data.length === 0) {
      list.innerHTML = "<p>No favorites saved yet.</p>";
      return;
    }

    list.innerHTML = result.data.map(item => `
      <div class="card">
        <h4>${item.recipe_name}</h4>
        <button class="btn btn-danger btn-sm" onclick="deleteFavorite(${item.id})">Remove</button>
      </div>
    `).join("");
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}

async function deleteFavorite(id) {
  if (!confirm("Remove from favorites?")) return;
  try {
    await api.deleteFavorite(id);
    ui.showAlert("Favorite removed!");
    loadFavorites();
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}
