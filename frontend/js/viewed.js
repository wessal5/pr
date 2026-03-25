document.addEventListener("DOMContentLoaded", () => {
  ui.renderNavbar("viewed");
  loadViewedHistory();
});

async function loadViewedHistory() {
  ui.showLoading("viewed-list");
  try {
    const result = await api.getViewedHistory();
    const list = document.getElementById("viewed-list");

    if (result.data.length === 0) {
      list.innerHTML = "<p>No history found.</p>";
      return;
    }

    list.innerHTML = `
      <table style="width:100%; text-align: left; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #eee;">
            <th style="padding: 10px;">Recipe</th>
            <th style="padding: 10px;">Viewed At</th>
          </tr>
        </thead>
        <tbody>
          ${result.data.map(item => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px;">${item.recipe_name}</td>
              <td style="padding: 10px;">${new Date(item.viewed_at).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    ui.showAlert(err.message, "danger");
  }
}
