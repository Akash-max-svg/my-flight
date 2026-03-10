import mongoose from 'mongoose';

// Meal Item Schema
const mealItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  cuisine: {
    type: String,
    enum: ['Indian', 'Continental', 'Asian', 'Mediterranean', 'Middle Eastern', 'American', 'Italian', 'Chinese', 'Japanese', 'Thai', 'Mexican', 'French', 'Vegan', 'Vegetarian'],
    required: true
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage', 'Dessert'],
    required: true
  },
  type: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  calories: {
    type: Number,
    default: 0
  },
  ingredients: [String],
  allergens: [String],
  spiceLevel: {
    type: String,
    enum: ['None', 'Mild', 'Medium', 'Hot', 'Extra Hot'],
    default: 'None'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  },
  available: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Meal Booking Schema (embedded in Booking model)
const mealBookingSchema = new mongoose.Schema({
  passengerIndex: {
    type: Number,
    required: true
  },
  passengerName: {
    type: String,
    required: true
  },
  meals: [{
    mealTime: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
      required: true
    },
    items: [{
      itemId: String,
      name: String,
      cuisine: String,
      type: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1,
        min: 1
      },
      specialInstructions: String
    }]
  }],
  beverages: [{
    name: String,
    type: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  specialRequests: {
    type: String,
    maxlength: 500
  },
  dietaryRestrictions: [String],
  totalPrice: {
    type: Number,
    default: 0
  }
});

const MealItem = mongoose.model('MealItem', mealItemSchema);

export { MealItem, mealBookingSchema, mealItemSchema };
export default MealItem;
