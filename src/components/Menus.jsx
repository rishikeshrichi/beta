import React, { useEffect, useState } from "react";
import "../animation/Css/Menus.css";
import MenuCard from "./MenuCard";
import axios from "axios";
import { Alert } from "react-bootstrap";
import Product from "./Product";

function Menus() {
  const [mealDBMenu, setMealDBMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Set "All" as the initial state
  const [alertMessage, setAlertMessage] = useState("");
  useEffect(() => {
    const fetchMealDBData = async () => {
      setIsLoading(true);
      try {
        let response;
        if (selectedCategory === "All") {
          response = await axios.get("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        } else {
          response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
          );
        }
        setMealDBMenu(response.data.meals || []);
      } catch (error) {
        console.error(error);
        setAlertMessage(selectedCategory);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMealDBData();
  }, [selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const showAlert =
    (selectedCategory === "Starter" || selectedCategory === "Side") && !mealDBMenu.length;

  const categories = [
    "All",
    "Beef",
    "Chicken",
    "Dessert",
    "Lamb",
    "Pork",
    "Seafood",
    "Side",
    "Starter",
    "Vegan",
    "Vegetarian",
  ];

  return (
    <section>
      <div>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-buttons1 ${selectedCategory === category ? "active" : ""}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="card-container">
          {isLoading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            mealDBMenu.map((meal) => (
              <div key={meal.idMeal}>
                <br />
                <MenuCard meal={meal} className="menucard" />
              </div>
            ))
          )}
        </div>
        <div className="menu-line"></div>
        {showAlert && (
          <Alert
            key={alertMessage}
            alertMessage={alertMessage}
            className="d-flex justify-content-center align-items-center"
          >
            Sorry, no dish found in {alertMessage}
          </Alert>
        )}
        <hr />
        <h4 style={{ textAlign: "center" }}>Post</h4>
        <Product filteredDishes={mealDBMenu} />
      </div>
    </section>
  );
}

export default Menus;
