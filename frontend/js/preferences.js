document.addEventListener("DOMContentLoaded", () => {
  ui.renderNavbar("preferences");
  loadPreferences();

  const form = document.getElementById("preference-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ingredient_name = document.getElementById("pref-name").value;

    try {
      await api.addPreference({ ingredient_name });
      ui.showAlert("Preference saved!");
      form.reset();
      loadPreferences();
    } catch (err) {
      ui.showAlert(err.message, "danger");
    }
  });
});

async function loadPreferences() {
  ui.showLoading("preferences-list");
  try {
    const result = await api.getPreferences();
    const list = document.getElementById("preferences-list");

    if (result.data.length === 0) {
      list.innerHTML = "<p>No preferences defined.</p>";
      return;
    }

    list.innerHTML = result.data.map(item => `
      <div class="card">
        <h4>${item.ingredient_name}</h4>
        <button class="btn btn-danger btn-sm" onclick="deletePreference(${item.id})">Remove</button>
      </div>
    `).join("");
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}

async function deletePreference(id) {
  if (!confirm("Delete preference?")) return;
  try {
    await api.deletePreference(id);
    ui.showAlert("Preference deleted!");
    loadPreferences();
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}
