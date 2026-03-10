import { useState } from 'react';
import { mealCategories, mealOptions, beverages, snacks } from '../data/mealOptions';

function MealSelection({ passengerIndex, passengerName, onMealSelect, selectedMeal }) {
  const [activeCategory, setActiveCategory] = useState('vegetarian');
  const [showBeverages, setShowBeverages] = useState(false);
  const [showSnacks, setShowSnacks] = useState(false);

  const filteredMeals = mealOptions.filter(meal => meal.category === activeCategory);

  const handleMealSelect = (meal) => {
    onMealSelect(passengerIndex, {
      ...meal,
      beverage: selectedMeal?.beverage || null,
      snack: selectedMeal?.snack || null
    });
  };

  const handleBeverageSelect = (beverage) => {
    onMealSelect(passengerIndex, {
      ...selectedMeal,
      beverage
    });
    setShowBeverages(false);
  };

  const handleSnackSelect = (snack) => {
    onMealSelect(passengerIndex, {
      ...selectedMeal,
      snack
    });
    setShowSnacks(false);
  };

  const totalMealPrice = () => {
    let total = selectedMeal?.price || 0;
    if (selectedMeal?.beverage) total += selectedMeal.beverage.price;
    if (selectedMeal?.snack) total += selectedMeal.snack.price;
    return total;
  };

  return (
    <>
      <style>{`
        .meal-selection-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
        }

        .passenger-info {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .meal-price-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
        }

        .category-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .category-tab {
          flex: 1;
          min-width: 120px;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .category-tab:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .category-tab.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .category-icon {
          font-size: 24px;
          display: block;
          margin-bottom: 5px;
        }

        .category-name {
          font-size: 14px;
          font-weight: 600;
        }

        .meals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .meal-card {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .meal-card:hover {
          border-color: #667eea;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(102,126,234,0.2);
        }

        .meal-card.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
        }

        .meal-image {
          font-size: 40px;
          text-align: center;
          margin-bottom: 10px;
        }

        .meal-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .meal-description {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .meal-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e5e7eb;
        }

        .meal-price {
          font-size: 18px;
          font-weight: 700;
          color: #667eea;
        }

        .meal-calories {
          font-size: 12px;
          color: #6b7280;
        }

        .extras-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
        }

        .extras-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #1f2937;
        }

        .extras-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .extra-btn {
          padding: 10px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
        }

        .extra-btn:hover {
          border-color: #667eea;
          background: #f3f4f6;
        }

        .extra-btn.selected {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }

        .selected-extras {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          flex-wrap: wrap;
        }

        .extra-chip {
          background: #f3f4f6;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .extra-chip-remove {
          cursor: pointer;
          color: #ef4444;
          font-weight: bold;
        }

        .no-meal-option {
          text-align: center;
          padding: 30px;
          color: #6b7280;
        }

        .skip-meal-btn {
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .skip-meal-btn:hover {
          background: #e5e7eb;
        }
      `}</style>

      <div className="meal-selection-container">
        <div className="meal-header">
          <div className="passenger-info">
            🍽️ Meal for {passengerName}
          </div>
          {selectedMeal && (
            <div className="meal-price-badge">
              ₹{totalMealPrice()}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {Object.entries(mealCategories).map(([key, category]) => (
            <div
              key={key}
              className={`category-tab ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              <span className="category-icon">{category.icon}</span>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>

        {/* Meals Grid */}
        <div className="meals-grid">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className={`meal-card ${selectedMeal?.id === meal.id ? 'selected' : ''}`}
              onClick={() => handleMealSelect(meal)}
            >
              <div className="meal-image">{meal.image}</div>
              <div className="meal-name">{meal.name}</div>
              <div className="meal-description">{meal.description}</div>
              <div className="meal-details">
                <div className="meal-price">₹{meal.price}</div>
                <div className="meal-calories">{meal.calories} cal</div>
              </div>
            </div>
          ))}
        </div>

        {/* Skip Meal Option */}
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button
            className="skip-meal-btn"
            onClick={() => onMealSelect(passengerIndex, null)}
          >
            Skip Meal Selection
          </button>
        </div>

        {/* Extras Section */}
        {selectedMeal && (
          <div className="extras-section">
            <div className="extras-title">Add Beverages & Snacks (Optional)</div>
            
            <div className="extras-buttons">
              <button
                className={`extra-btn ${showBeverages ? 'selected' : ''}`}
                onClick={() => setShowBeverages(!showBeverages)}
              >
                🥤 Add Beverage
              </button>
              <button
                className={`extra-btn ${showSnacks ? 'selected' : ''}`}
                onClick={() => setShowSnacks(!showSnacks)}
              >
                🍪 Add Snack
              </button>
            </div>

            {/* Beverage Selection */}
            {showBeverages && (
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {beverages.map((bev) => (
                    <button
                      key={bev.id}
                      className="extra-btn"
                      onClick={() => handleBeverageSelect(bev)}
                    >
                      {bev.icon} {bev.name} - ₹{bev.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Snack Selection */}
            {showSnacks && (
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {snacks.map((snack) => (
                    <button
                      key={snack.id}
                      className="extra-btn"
                      onClick={() => handleSnackSelect(snack)}
                    >
                      {snack.icon} {snack.name} - ₹{snack.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Extras */}
            {(selectedMeal?.beverage || selectedMeal?.snack) && (
              <div className="selected-extras">
                {selectedMeal.beverage && (
                  <div className="extra-chip">
                    {selectedMeal.beverage.icon} {selectedMeal.beverage.name} - ₹{selectedMeal.beverage.price}
                    <span
                      className="extra-chip-remove"
                      onClick={() => handleBeverageSelect(null)}
                    >
                      ×
                    </span>
                  </div>
                )}
                {selectedMeal.snack && (
                  <div className="extra-chip">
                    {selectedMeal.snack.icon} {selectedMeal.snack.name} - ₹{selectedMeal.snack.price}
                    <span
                      className="extra-chip-remove"
                      onClick={() => handleSnackSelect(null)}
                    >
                      ×
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default MealSelection;
