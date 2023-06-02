import React, { useState, useEffect , useContext } from 'react';
import axios from 'axios';
import '../animation/Css/SP.css';
import { Container, Row, Col } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import PopUp from './PopUp';


function SpecialDishes(props) {
  
  const maxSpecialDishes = 10;
  const [specialDishes, setSpecialDishes] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [meal, setMeal ] = useState({});
  const [item, setItem] = useState({});
  const [strCategory, setStrCategory] = useState('');
  const [strIngredients, setStrIngredients] = useState('');

  function closePopupHandler() {
    setShowPopUp(false);
  };

  useEffect(() => {
    axios.get('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast')
      .then(response => {
        setSpecialDishes(response.data.meals);
      })
      .catch(error => console.log(error));
  }, []);

  const paragraphText = "";

  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (menuItems) => {
    setMeal(menuItems);
    setStrIngredients(menuItems.strIngredient1 + ', ' + menuItems.strIngredient2 + ', ' + menuItems.strIngredient3);
    setShowPopUp(true);
  };
  useEffect(() => {
    setStrIngredients(meal.strIngredient1 + ', ' + meal.strIngredient2 + ', ' + meal.strIngredient3);
  }, [meal]);
  

  const specialMenus = specialDishes.slice(0, maxSpecialDishes).map(menuItems => (
    <li className="card" key={menuItems.idMeal}>
      <a className="card__background" style={{ backgroundImage: `url(${menuItems.strMealThumb })` }} onClick={() => handleCardClick(menuItems)}></a>
      <a className="card__content">
        <a className="card__category">{menuItems.strCategory}</a>
        <h4 className="card__heading" onClick={() => handleCardClick(menuItems)}>{menuItems.strMeal}</h4>
      </a>
    </li>
  ));

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <Container fluid>
      {showPopUp && <PopUp strMeal={meal.strMeal} strMealThumb={meal.strMealThumb} strCategory={item.strCategory} strIngredients={meal.strIngredients} closePopup={closePopupHandler} />}
      <Row>
        <Col className='col' md={4} sm={12}>
          <div className="special-dishes-container">
            <span></span> <h2>Special Dishes</h2>
            <p className="ul">{isExpanded ? paragraphText : `${paragraphText.substring(0, 100)}...`}</p>
            <span className="li" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Show less" : "Show more"}
            </span>
          </div>
        </Col>
        
        <Col style={{width:"10px"}}>
          <div className="special-dishes-scroll" >
            <Slider {...settings}>
              {specialMenus}
            </Slider>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SpecialDishes;
