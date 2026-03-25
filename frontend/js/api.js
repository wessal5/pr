const API_BASE_URL = "http://localhost:3000";

const api = {
  // Generic Fetch wrapper
  async request(endpoint, method = "GET", body = null) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }
      return result;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  },

  // Ingredients API
  getIngredients: () => api.request("/ingredients"),
  addIngredient: (data) => api.request("/ingredients", "POST", data),
  updateIngredient: (id, data) => api.request(`/ingredients/${id}`, "PUT", data),
  deleteIngredient: (id) => api.request(`/ingredients/${id}`, "DELETE"),

  // Recipes API
  getRecipes: () => api.request("/recipes"),
  getRecipeById: (id) => api.request(`/recipes/${id}`),
  addRecipe: (data) => api.request("/recipes", "POST", data),
  getSuggestions: () => api.request("/recipes/suggestions"),

  // Shopping List API
  getShoppingList: () => api.request("/shopping-list"),
  addShoppingListItem: (data) => api.request("/shopping-list", "POST", data),
  toggleShoppingItem: (id) => api.request(`/shopping-list/${id}`, "PATCH"),
  deleteShoppingItem: (id) => api.request(`/shopping-list/${id}`, "DELETE"),

  // Favorites API
  getFavorites: () => api.request("/favorites"),
  addFavorite: (data) => api.request("/favorites", "POST", data),
  deleteFavorite: (id) => api.request(`/favorites/${id}`, "DELETE"),

  // Viewed API
  getViewedHistory: () => api.request("/viewed"),
  addViewed: (data) => api.request("/viewed", "POST", data),

  // Preferences API
  getPreferences: () => api.request("/preferences"),
  addPreference: (data) => api.request("/preferences", "POST", data),
  deletePreference: (id) => api.request(`/preferences/${id}`, "DELETE"),
};
