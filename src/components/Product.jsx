import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../animation/Css/Menus.css';
import shoppingCartIcon from '../animation/Asset/icons8-cart.gif';
import { FirebaseContext } from '../store/FirebaseContext';
import { PostContext } from '../store/PostContext';

function Product() {
  const [products, setProducts] = useState([]);
  const { setPostDetails, user } = useContext(PostContext);
  const { firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await firebase.firestore().collection('products').get();
        const allProducts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(allProducts);
      } catch (error) {
        console.log('Error getting products:', error);
      }
    };

    fetchProducts();
  }, [firebase]);


  const handleProductClick = (product) => {
    if (!firebase.auth().currentUser) {
      navigate('/login');
      return;
    }
  
    setPostDetails(product);
    navigate(`/view/${product.id}`);
  };
  
  const addToCart = (product) => {
    const currentUser = firebase.auth().currentUser;
  
    if (!currentUser) {
      navigate('/login');
      return;
    }
  
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find((item) => item.id === product.id);
  
    if (existingItem) {
      console.log('Product already in cart:', product.name);
      return;
    }
  
    cartItems.push(product);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('Product added to cart:', product.name);
  
    // Update the user's profile with the cart information
    const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
    userRef
      .update({
        cart: cartItems,
      })
      .then(() => {
        console.log('Cart added to user profile');
      })
      .catch((error) => {
        console.log('Error updating user profile:', error);
      });
  };
  

  return (
    <section className="card-container" style={{justifyItems:"center",width:"100%"}}>
     {products.map((product) => (
  <div
    key={product.id}
    className="card"
    onClick={() => handleProductClick(product)}
    style={{justifyItems:"center",marginLeft:"10px"}}
  >
          <div className="card-image">
            <img style={{ width: 'cover' }} src={product.url} alt={product.name} />
            <div className="cart-icon">
            </div>
          </div>
          <div className={`card-description ${product.name.length > 20 ? 'long-name' : ''}`}>
            <p className={`card-name ${product.name.length > 20 ? 'running-effect' : ''}`}>
              {product.name}
            </p>
            <div>
              <span>{product.createdAt}</span>
            </div>
            <div>{product.uploaderName}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Product;