document.addEventListener("DOMContentLoaded", () => {
  ui.renderNavbar("shopping-list");
  loadShoppingList();

  const form = document.getElementById("shopping-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("item-name").value;
    const type = document.getElementById("item-type").value;

    try {
      await api.addShoppingListItem({ name, type });
      ui.showAlert("Item added to list!");
      form.reset();
      loadShoppingList();
    } catch (err) {
      ui.showAlert(err.message, "danger");
    }
  });
});

async function loadShoppingList() {
  ui.showLoading("essential-list");
  ui.showLoading("optional-list");

  try {
    const result = await api.getShoppingList();
    const { essential, optional } = result.data;

    renderGroup(essential, "essential-list");
    renderGroup(optional, "optional-list");
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}

function renderGroup(items, elementId) {
  const container = document.getElementById(elementId);
  if (items.length === 0) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  container.innerHTML = items.map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="checkbox" ${item.checked ? 'checked' : ''} onclick="toggleItem(${item.id})">
        <span style="${item.checked ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${item.name}</span>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
    </div>
  `).join('');
}

async function toggleItem(id) {
  try {
    await api.toggleShoppingItem(id);
    loadShoppingList();
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}

async function deleteItem(id) {
  if (!confirm("Are you sure?")) return;
  try {
    await api.deleteShoppingItem(id);
    ui.showAlert("Item deleted!");
    loadShoppingList();
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}
