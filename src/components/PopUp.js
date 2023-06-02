import React from 'react';
import '../animation/PopUp.scss';
import { useNavigate } from 'react-router';

function PopUp({ strMeal, strMealThumb, strMealThumbSmall, closePopup, strCategory, strIngredient1, strArea, strInstructions, strIngredient2, strIngredient3 }) {
  const instructionSentences = strInstructions.split(". ");
  const navigate = useNavigate();

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <img className="img" src={strMealThumb} alt={strMeal} />
          <img className="img-small" src={strMealThumb} alt={strMeal} />
          <h5 style={{ color: "black" }} className="popup-header-category">{strCategory}</h5>
        </div>
        <h2 style={{ color: "white" }} className="p-w">{strMeal}</h2>
        <ul style={{ color: "white", margin: "10px 0" }}>
          {instructionSentences.map((sentence, index) => (
            <li key={index} style={{ marginBottom: "10px" ,fontWeight:"300" , fontSize:'20px' }}>{sentence.trim()}</li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', padding: 0 }} className='dish-ingredients'>
          <li className="dish-ingredients" style={{ color: "black" }}>{strIngredient2}</li>
          <li style={{ color: "black" }}>{strIngredient3}</li>
        </div>

      </div>
      <h1 style={{ fontSize: "35px" , width: "50px"}} className="popup-close" onClick={closePopup}>
        X
      </h1>
    </div>
  );
}

export default PopUp;

