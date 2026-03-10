import express from 'express';
import csvMealService from '../services/csv-meal.service.js';

const router = express.Router();

// Get all meals from CSV
router.get('/meals', async (req, res) => {
  try {
    const meals = await csvMealService.getAllMeals();
    res.json({ success: true, meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ success: false, message: 'Failed to load meals' });
  }
});

// Search meals
router.get('/meals/search', async (req, res) => {
  try {
    const { query } = req.query;
    const meals = await csvMealService.searchMeals(query);
    res.json({ success: true, meals });
  } catch (error) {
    console.error('Error searching meals:', error);
    res.status(500).json({ success: false, message: 'Failed to search meals' });
  }
});

// Get meals by price range
router.get('/meals/price-range', async (req, res) => {
  try {
    const { min, max } = req.query;
    const minPrice = parseInt(min) || 1000;
    const maxPrice = parseInt(max) || 1700;
    
    const meals = await csvMealService.getMealsByPriceRange(minPrice, maxPrice);
    res.json({ success: true, meals });
  } catch (error) {
    console.error('Error fetching meals by price:', error);
    res.status(500).json({ success: false, message: 'Failed to filter meals' });
  }
});

export default router;
