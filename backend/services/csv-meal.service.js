import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CSVMealService {
  constructor() {
    this.meals = [];
    this.isLoaded = false;
  }

  async loadMeals() {
    if (this.isLoaded) return this.meals;

    const csvPath = path.join(__dirname, '../en.openfoodfacts.org.products.csv');
    
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          // Parse CSV row and extract relevant meal data
          // Assuming CSV has columns: product_name, energy_100g, price, etc.
          if (data.product_name && data.energy_100g) {
            const price = this.calculatePrice(data);
            
            // Only include items in price range ₹1000-₹1700
            if (price >= 1000 && price <= 1700) {
              results.push({
                id: data.code || `meal-${results.length}`,
                name: data.product_name,
                description: data.generic_name || data.product_name,
                price: price,
                calories: parseInt(data.energy_100g) || 0,
                category: this.categorizeFood(data),
                ingredients: data.ingredients_text ? data.ingredients_text.split(',').slice(0, 5) : [],
                image: '🍽️'
              });
            }
          }
        })
        .on('end', () => {
          this.meals = results;
          this.isLoaded = true;
          console.log(`Loaded ${results.length} meals from CSV`);
          resolve(results);
        })
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });
  }

  calculatePrice(data) {
    // Generate price based on product data or use default range
    const basePrice = 1000;
    const maxPrice = 1700;
    
    // Use energy value to influence price
    const energy = parseInt(data.energy_100g) || 300;
    const priceMultiplier = Math.min(energy / 500, 1.5);
    
    return Math.round(basePrice + (maxPrice - basePrice) * priceMultiplier * Math.random());
  }

  categorizeFood(data) {
    const name = (data.product_name || '').toLowerCase();
    const ingredients = (data.ingredients_text || '').toLowerCase();
    
    if (name.includes('vegan') || ingredients.includes('vegan')) {
      return 'vegan';
    } else if (name.includes('chicken') || name.includes('meat') || name.includes('fish')) {
      return 'nonVegetarian';
    } else if (name.includes('gluten-free') || name.includes('diabetic')) {
      return 'special';
    } else {
      return 'vegetarian';
    }
  }

  async searchMeals(query) {
    if (!this.isLoaded) {
      await this.loadMeals();
    }

    if (!query) return this.meals;

    const searchTerm = query.toLowerCase();
    return this.meals.filter(meal => 
      meal.name.toLowerCase().includes(searchTerm) ||
      meal.description.toLowerCase().includes(searchTerm) ||
      meal.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
    );
  }

  async getMealsByPriceRange(minPrice, maxPrice) {
    if (!this.isLoaded) {
      await this.loadMeals();
    }

    return this.meals.filter(meal => 
      meal.price >= minPrice && meal.price <= maxPrice
    );
  }

  async getAllMeals() {
    if (!this.isLoaded) {
      await this.loadMeals();
    }
    return this.meals;
  }
}

export default new CSVMealService();
