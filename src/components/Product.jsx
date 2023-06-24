import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../animation/Css/Menus.css';
import shoppingCartIcon from '../animation/Asset/icons8-cart.gif';
import { FirebaseContext } from '../store/FirebaseContext';
import { PostContext } from '../store/PostContext';
import "../animation/Css/Card.css"
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
    navigate(`/view`, { state: { postDetails: product } });
  };
  const handleDelete = async (productId) => {
    try {
      // Delete the product from Firestore
      await firebase.firestore().collection('products').doc(productId).delete();
      // Refresh the products list
      
    } catch (error) {
      console.log('Error deleting product:', error);
    }
  };
  
 
  

  return (
    <section className="card-container" style={{justifyItems:"center",width:"100%",gap:"25px"}}>
      {products.map((product) => (
        <div
          key={product.id}
          className="card"
          onClick={() => handleProductClick(product)}
          style={{justifyItems:"center",marginLeft:"10px"}}
        >
          <div className="card-image">
            <img style={{ width: 'cover' }} src={product.url} alt={product.name} />
            <div >
            </div>
          </div>
          
          <div className={`card-description ${product.name.length > 30 ? 'long-name' : ''}`}>
            <p className={`card-name ${product.name.length > 30 ? 'running-effect' : ''}`}>
              {product.name}
            </p>
           
            <div>
              <div className='product-det'>
                {user && user.profilePicture && (
                  <img src={user.profilePicture} alt="Profile Avatar" className='uploader-img' />
                )}
                
                <div className='uploader-name'>{product.uploaderName}</div>
              </div>
              <span className='date'>{product.createdAt}</span>
              <span>{product.likes}</span>
              
            </div>
          </div>
          
        </div>
        
      ))}
      
    </section>
  );
}

export default Product;
