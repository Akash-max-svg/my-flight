import api from './api';

const API_URL = 'http://localhost:5000/api/csv-meals';

export const csvMealService = {
  // Get all meals from CSV
  async getAllMeals() {
    try {
      const response = await fetch(`${API_URL}/meals`);
      const data = await response.json();
      return data.success ? data.meals : [];
    } catch (error) {
      console.error('Error fetching meals:', error);
      return [];
    }
  },

  // Search meals by query
  async searchMeals(query) {
    try {
      const response = await fetch(`${API_URL}/meals/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.success ? data.meals : [];
    } catch (error) {
      console.error('Error searching meals:', error);
      return [];
    }
  },

  // Get meals by price range
  async getMealsByPriceRange(minPrice, maxPrice) {
    try {
      const response = await fetch(`${API_URL}/meals/price-range?min=${minPrice}&max=${maxPrice}`);
      const data = await response.json();
      return data.success ? data.meals : [];
    } catch (error) {
      console.error('Error filtering meals by price:', error);
      return [];
    }
  }
};

export default csvMealService;
