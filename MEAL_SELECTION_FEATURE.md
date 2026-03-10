# ✅ Meal Selection Feature - Implementation Guide

## 🎯 What's Being Added

**Feature:** Food/Meal selection during flight booking

**When:** After passenger details, before seat selection

**Options:**
- Main meals (Vegetarian, Non-Vegetarian, Vegan, Special Diet)
- Beverages (Water, Soft Drinks, Coffee, Tea, Juice)
- Snacks (Chips, Cookies, Nuts, Chocolate, Sandwich, Fruits)

---

## 📊 Meal Options

### Categories

1. **Vegetarian** 🥗
   - Paneer Butter Masala - ₹250
   - Veg Biryani - ₹220
   - Pasta Primavera - ₹280
   - Dal Makhani Combo - ₹200

2. **Non-Vegetarian** 🍗
   - Butter Chicken - ₹320
   - Chicken Biryani - ₹300
   - Grilled Chicken Sandwich - ₹280
   - Fish Curry Combo - ₹350

3. **Vegan** 🌱
   - Quinoa Buddha Bowl - ₹300
   - Vegan Pasta - ₹270
   - Tofu Stir Fry - ₹290

4. **Special Diet** ⭐
   - Gluten-Free Meal - ₹320
   - Low-Calorie Meal - ₹280
   - Diabetic-Friendly Meal - ₹300

### Beverages 🥤
- Water - Free
- Soft Drink - ₹50
- Juice - ₹80
- Coffee - ₹100
- Tea - ₹80
- Mineral Water - ₹30

### Snacks 🍪
- Chips - ₹50
- Cookies - ₹60
- Nuts Mix - ₹100
- Chocolate - ₹80
- Sandwich - ₹150
- Fruit Bowl - ₹120

---

## 🎨 UI Features

### Meal Selection Card
- Beautiful category tabs with icons
- Grid layout for meal options
- Meal cards with:
  - Image/Icon
  - Name
  - Description
  - Price
  - Calories
  - Spice level
- Selected state highlighting
- Skip meal option

### Extras Section
- Add beverage button
- Add snack button
- Selected items display
- Remove option for extras
- Total price calculation

### Per Passenger
- Individual meal selection for each passenger
- Passenger name displayed
- Total meal cost per passenger
- Optional selection (can skip)

---

## 🔄 Booking Flow

### Updated Steps

**Step 1:** Passenger Details
- Enter passenger information
- Contact details

**Step 2:** Meal Selection (NEW!)
- Select meal for each passenger
- Add beverages (optional)
- Add snacks (optional)
- Skip if not needed

**Step 3:** Seat Selection
- Choose seats for passengers
- View seat map

**Step 4:** Payment & Confirmation
- Review all details
- See total price (flight + meals + seats)
- Confirm booking

---

## 💾 Data Structure

### Meal Data Stored in Booking

```javascript
{
  passengers: [
    {
      firstName: "John",
      lastName: "Doe",
      age: 30,
      gender: "male",
      meal: {
        id: "non-veg-1",
        name: "Butter Chicken",
        price: 320,
        category: "nonVegetarian",
        beverage: {
          id: "bev-4",
          name: "Coffee",
          price: 100
        },
        snack: {
          id: "snack-3",
          name: "Nuts Mix",
          price: 100
        }
      }
    }
  ],
  pricing: {
    basePrice: 5000,
    mealPrice: 520, // 320 + 100 + 100
    seatPrice: 200,
    totalPrice: 5720
  }
}
```

---

## 📁 Files Created

### 1. Meal Options Data
**File:** `src/data/mealOptions.js`

**Contains:**
- Meal categories with icons and colors
- 15+ meal options with details
- 6 beverage options
- 6 snack options
- Prices, calories, ingredients

### 2. Meal Selection Component
**File:** `src/Components/MealSelection.jsx`

**Features:**
- Category tabs
- Meal grid display
- Beverage selection
- Snack selection
- Price calculation
- Skip option

### 3. Updated Booking Component
**File:** `src/Components/Booking.jsx` (to be updated)

**Changes:**
- Add meal selection step
- Store meal data
- Calculate meal prices
- Pass to booking service

---

## 🎯 User Experience

### Flow Example

1. **User enters passenger details**
   ```
   Passenger 1: John Doe, 30, Male
   Passenger 2: Jane Doe, 28, Female
   ```

2. **Click "Next" → Meal Selection appears**
   ```
   Select meal for John Doe
   - Choose category: Non-Vegetarian
   - Select: Butter Chicken (₹320)
   - Add beverage: Coffee (₹100)
   - Add snack: Nuts Mix (₹100)
   Total for John: ₹520
   ```

3. **Select meal for next passenger**
   ```
   Select meal for Jane Doe
   - Choose category: Vegetarian
   - Select: Paneer Butter Masala (₹250)
   - Add beverage: Juice (₹80)
   - Skip snack
   Total for Jane: ₹330
   ```

4. **Click "Next" → Seat Selection**
   ```
   Choose seats for passengers
   ```

5. **Click "Next" → Payment**
   ```
   Flight: ₹10,000
   Meals: ₹850 (₹520 + ₹330)
   Seats: ₹400
   Total: ₹11,250
   ```

---

## 💡 Benefits

### For Passengers
- ✅ Pre-order meals
- ✅ Dietary preferences
- ✅ No waiting on flight
- ✅ Guaranteed meal choice
- ✅ See prices upfront
- ✅ Optional (can skip)

### For Airline
- ✅ Better planning
- ✅ Reduced waste
- ✅ Additional revenue
- ✅ Customer satisfaction
- ✅ Dietary tracking

### For System
- ✅ Complete booking data
- ✅ Revenue tracking
- ✅ Meal analytics
- ✅ Inventory management

---

## 🧪 Testing Checklist

### Test Meal Selection
- [ ] Category tabs work
- [ ] Meal cards display correctly
- [ ] Selection highlights
- [ ] Price updates
- [ ] Skip option works

### Test Beverages
- [ ] Beverage list shows
- [ ] Selection works
- [ ] Price adds to total
- [ ] Remove option works

### Test Snacks
- [ ] Snack list shows
- [ ] Selection works
- [ ] Price adds to total
- [ ] Remove option works

### Test Multiple Passengers
- [ ] Each passenger gets meal selection
- [ ] Independent selections
- [ ] Total calculates correctly
- [ ] Data saves properly

### Test Booking Flow
- [ ] Step 1: Passenger details
- [ ] Step 2: Meal selection
- [ ] Step 3: Seat selection
- [ ] Step 4: Payment
- [ ] Booking confirmation
- [ ] Email includes meal details

---

## 📊 Pricing Examples

### Example 1: Budget Traveler
```
Flight: ₹5,000
Meal: Skip
Seat: Economy (Free)
Total: ₹5,000
```

### Example 2: Standard Traveler
```
Flight: ₹5,000
Meal: Veg Biryani (₹220) + Water (Free)
Seat: Economy (Free)
Total: ₹5,220
```

### Example 3: Premium Traveler
```
Flight: ₹5,000
Meal: Butter Chicken (₹320) + Coffee (₹100) + Nuts (₹100)
Seat: Premium (₹200)
Total: ₹5,720
```

### Example 4: Family (2 Adults, 1 Child)
```
Flight: ₹15,000 (3 tickets)
Meals:
  - Adult 1: Chicken Biryani (₹300) + Juice (₹80)
  - Adult 2: Paneer Masala (₹250) + Tea (₹80)
  - Child: Pasta (₹280) + Soft Drink (₹50)
Seats: 3 × ₹100 = ₹300
Total: ₹16,340
```

---

## 🎨 Design Features

### Visual Elements
- Category icons (🥗 🍗 🌱 ⭐)
- Meal images/emojis
- Color-coded categories
- Gradient backgrounds
- Hover effects
- Selected state highlighting

### Responsive Design
- Grid layout adapts to screen size
- Mobile-friendly
- Touch-friendly buttons
- Scrollable meal list

### User Feedback
- Visual selection feedback
- Price updates in real-time
- Total displayed prominently
- Clear skip option

---

## 🚀 Implementation Status

### Created ✅
- [x] Meal options data file
- [x] Meal selection component
- [x] Category system
- [x] Beverage options
- [x] Snack options
- [x] Price calculation

### To Do ⏳
- [ ] Integrate with Booking component
- [ ] Update booking flow steps
- [ ] Add meal price to total
- [ ] Save meal data to database
- [ ] Include meals in email
- [ ] Add to ticket PDF

---

## 📞 Quick Reference

### Meal Price Range
- Vegetarian: ₹200 - ₹280
- Non-Vegetarian: ₹280 - ₹350
- Vegan: ₹270 - ₹300
- Special Diet: ₹280 - ₹320

### Extras Price Range
- Beverages: Free - ₹100
- Snacks: ₹50 - ₹150

### Average Meal Cost
- Basic: ₹200 - ₹250
- Standard: ₹250 - ₹350
- Premium: ₹350 - ₹500 (with extras)

---

## ✅ Summary

**Feature:** Meal selection during booking  
**Step:** Between passenger details and seat selection  
**Options:** 15+ meals, 6 beverages, 6 snacks  
**Pricing:** ₹200 - ₹500 per passenger  
**Optional:** Yes, can skip  
**Per Passenger:** Individual selection  
**Status:** Ready to integrate  

---

**Meal selection feature is ready to be integrated into the booking flow!** 🍽️✈️
