const ui = {
  // Render common Navbar
  renderNavbar: (activePage = "dashboard") => {
    const nav = document.getElementById("navbar");
    if (!nav) return;

    const navLinks = [
      { id: "dashboard", label: "Dashboard", href: "index.html" },
      { id: "ingredients", label: "Ingredients", href: "ingredients.html" },
      { id: "recipes", label: "Recipes", href: "recipes.html" },
      { id: "shopping-list", label: "Shopping List", href: "shopping-list.html" },
      { id: "favorites", label: "Favorites", href: "favorites.html" },
      { id: "viewed", label: "Viewed", href: "viewed.html" },
      { id: "preferences", label: "Preferences", href: "preferences.html" },
    ];

    const linksHtml = navLinks
      .map(
        (link) => `
      <a href="${link.href}" class="${activePage === link.id ? "active" : ""}" style="${activePage === link.id ? "border-bottom: 2px solid var(--primary);" : ""}">
        ${link.label}
      </a>`
      )
      .join("");

    nav.innerHTML = `
      <div class="navbar">
        <div style="font-size: 1.25rem; font-weight: bold;">Smart Home Manager</div>
        <div class="nav-links">
          ${linksHtml}
        </div>
      </div>
    `;
  },

  // Show Alert
  showAlert: (message, type = "success") => {
    const alertBox = document.createElement("div");
    alertBox.className = `alert alert-${type}`;
    alertBox.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      background-color: ${type === "success" ? "var(--success)" : "var(--danger)"};
      z-index: 2000;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: opacity 0.5s ease-in-out;
    `;
    alertBox.innerText = message;
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 500);
    }, 3000);
  },

  // Show Loading state in an element
  showLoading: (elementId) => {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = `<div class="loading">Loading...</div>`;
  },
};
