import React, { useState } from "react";
import "../animation/Css/Menus.css";
import PopUp from './PopUp';

function MenuCard({ meal, addToCart }) {
  const [showPopup, setShowPopup] = useState(false);
  const { strMeal, strMealThumb, strCategory, strArea, strInstructions, strIngredient3, strIngredient2 } = meal;

  function handleCardClick() {
    setShowPopup(true);
  }

  function closePopupHandler() {
    setShowPopup(false);
  };

  function handleAddToCart() {
    addToCart(meal);
}

  return (
    
    <div className="card-container">
      {showPopup && <PopUp strCategory={strCategory} strMeal={strMeal} strMealThumb={strMealThumb} strIngredient3={strIngredient3} strArea={strArea} strInstructions={strInstructions} strIngredient2={strIngredient2} closePopup={closePopupHandler} />}
      <div className="card">
        <div className="card-image">
          <img src={strMealThumb} alt={strMeal} onClick={handleCardClick}/>
        </div>
        <div className="card-description">
          <p className="card-title">{strMeal}</p>
        </div>
      </div>
    </div>
    
    
  );
}

export default MenuCard;
