import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FirebaseContext, AuthContext } from '../store/FirebaseContext';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { Navigate, useNavigate } from 'react-router';
import Header from '../components/Header';

function EditRecipe({ recipeId }) {
  const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState('');
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [category, setCategory] = useState('');
  const [instructions, setInstruction] = useState('');
  const [image, setImage] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderDetails, setUploaderDetails] = useState(null);
  const [userAvatar, setUserAvatar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUploaderName(user.displayName);
      setUserAvatar(user.photoURL);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      firebase
        .firestore()
        .collection('products')
        .doc(recipeId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const recipeData = doc.data();
            setName(recipeData.name);
            setIngredients(recipeData.ingredients);
            setCategory(recipeData.category);
            setInstruction(recipeData.instructions);
            setImage('');
            setImagePreview(recipeData.url);
          } else {
            console.log('No recipe found with the given ID');
          }
        })
        .catch((error) => {
          console.log('Error fetching recipe:', error);
        });

      firebase
        .firestore()
        .collection('uploaders')
        .where('recipeId', '==', recipeId)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const uploaderDoc = querySnapshot.docs[0];
            setUploaderDetails(uploaderDoc.data());
          }
        })
        .catch((error) => {
          console.log('Error fetching uploader details:', error);
        });
    }
  }, [firebase, user, recipeId]);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
      setShowUploadButton(false);
    };

    if (file) {
      setImage(file);
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
      setShowUploadButton(true);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setShowUploadButton(true);
  };

  const handleUpdate = () => {
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`/images/${name}`);

    // Perform the necessary update operation using firebase.firestore().collection('products').doc(recipeId).update()

    navigate('/');
  };

  return (
    <section>
      <Header />
      <h5 href="Home" onClick={() => navigate('/')}>
        Back
      </h5>
      <div className="upload-container">
        <h2>Edit Food Recipe</h2>

        <div className="image-container">
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="preview" />
              <button type="button" className="remove-button" onClick={handleRemoveImage}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}
          {showUploadButton && (
            <label htmlFor="image" className="custom-file-upload">
              <input type="file" id="image" name="image" accept="image/*" onChange={handleImagePreview} />
              Upload Image
            </label>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            id="uploaderName"
            name="uploaderName"
            required
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            style={{ width: '100%', opacity: '0' }}
            disabled
          />
          <label htmlFor="title" displayName>Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Category</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%' }}
            autoComplete="non-veg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            name="ingredients"
            required
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={{ width: '100%' }}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            required
            value={instructions}
            onChange={(e) => setInstruction(e.target.value)}
            style={{ width: '100%' }}
          ></textarea>
        </div>

        <div className="form-group">
          <button onClick={handleUpdate} type="submit" style={{ borderRadius: "30px", justifyContent: "center", display: "flex", marginLeft: "auto", marginRight: "auto" }}>
            Update
          </button>
        </div>
      </div>

      {uploaderDetails && (
        <div>
          <h3>Uploader Details</h3>
          <p>Uploader Name: {uploaderDetails.uploaderName}</p>
          <p>Uploader ID: {uploaderDetails.uploaderId}</p>
          <p>Recipe ID: {uploaderDetails.recipeId}</p>
          <img src={uploaderDetails.profilePicture} alt="Uploader Profile" />
        </div>
      )}
    </section>
  );
}

export default EditRecipe;
