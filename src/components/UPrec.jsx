import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FirebaseContext, AuthContext } from '../store/FirebaseContext';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { Navigate, useNavigate } from 'react-router';
import Header from './Header';

function Upload() {
  const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState('');
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [category, setCategory] = useState('');
  const [instructions, setInstruction] = useState('');
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const [uploaderName, setUploaderName] = useState(''); // Add the uploaderName state
  const [uploaderDetails, setUploaderDetails] = useState(null); // Add the uploaderDetails state
  const [userAvatar, setUserAvatar] = useState(''); 
  useEffect(() => {
    if (user) {
      setUploaderName(user.displayName); 
      setUserAvatar(user.photoURL);
    }
  }, [user]);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
      setShowUploadButton(false);
    };

    if (file) {
      setImage(file); // Set the image state with the selected file
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

  const handleSubmit = () => {
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`/images/${name}`); // Specify the desired storage path for the image

    imageRef
      .put(image)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        console.log(url);
        // Save the image URL to Firestore or perform any other necessary actions
        firebase
          .firestore()
          .collection('products')
          .add({
            name,
            url,
            username, // Add the username field
            ingredients,
            instructions,
            category,
            userId: user.uid,
            createdAt: date.toDateString(),
            uploaderName,
          })
          .then((docRef) => {
            // Store uploader details in 'uploaders' collection
            firebase
              .firestore()
              .collection('uploaders')
              .add({
                uploaderId: user.uid,
                uploaderName,
                recipeId: docRef.id,
              });
            navigate('/');
          })
          .catch((error) => {
            console.log('Error uploading recipe:', error);
          });
      })
      .catch((error) => {
        console.log('Error uploading image:', error);
      });
  };

  // Fetch uploader details based on the recipe's ID
  useEffect(() => {
    if (user) {
      firebase
        .firestore()
        .collection('uploaders')
        .where('recipeId', '==', '{RECIPE_ID}') // Replace '{RECIPE_ID}' with the actual recipe's ID
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
  }, [user]);

  return (
    <section>
      <Header />
      <h5 href="Home" onClick={() => navigate('/')}>
        Back
      </h5>
      <div className="upload-container">
        <h2>Upload Food Recipe</h2>
        
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
            id="uploaderName" // Add an id for the uploader name input
            name="uploaderName"
            required
            value={uploaderName} // Bind the uploaderName value
            onChange={(e) => setUploaderName(e.target.value)} // Handle changes to the uploaderName input
            style={{ width: '100%', opacity: '0' }}
            disabled
          />
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
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
            onChange={(e) => setInstruction(e.target.value)}
            style={{ width: '100%' }}
          ></textarea>
        </div>

        <div className="form-group">
        <button onClick={handleSubmit} type="submit" style={{ borderRadius: "30px", justifyContent: "center", display: "flex", marginLeft: "auto", marginRight: "auto" }}>
  Upload
</button>

        </div>
      </div>

      {/* Display uploader details */}
      {uploaderDetails && (
        <div>
          <h3>Uploader Details</h3>
          <p>Uploader Name: {uploaderDetails.uploaderName}</p>
          <p>Uploader ID: {uploaderDetails.uploaderId}</p>
          <p>Recipe ID: {uploaderDetails.recipeId}</p>
        </div>
      )}
    </section>
  );
}

export default Upload;
