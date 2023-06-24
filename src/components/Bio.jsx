import React, {useRef, useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/FirebaseContext";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { FaEdit } from "react-icons/fa";
import "./Profile.css";
import { navigate, useNavigate } from "react-router-dom";
import { PostContext } from "../store/PostContext";
import shoppingCartIcon from '../animation/Asset/icons8-cart.gif';
import { FirebaseContext } from '../store/FirebaseContext';
import "firebase/compat/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisStrokeVertical,faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { BsCheckCircle } from "react-icons/bs";
import '../animation/Css/Card.css'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Product from "./Product";


function Profile(recipeId,productId) {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const { setPostDetails } = useContext(PostContext);
  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const [followingCount, setFollowingCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const isUserVerified = user && user.uid === "7e4LnM6OVSZnLaFa2wCB3L1Oc9i1";
  const [showDropdown, setShowDropdown] = useState(false);
  const iconRef = useRef(null);
  const menuRef = useRef(null);
  const [currentIcon, setCurrentIcon] = useState(faEllipsisVertical);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "Your Full Name");
      setProfilePicture(
        user.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.displayName || "Unknown"
          )}&background=0D8ABC&color=fff&size=128`
      );
      setNewDisplayName(user.displayName || "");
      setUserImages([
        "path/to/image1.jpg",
        "path/to/image2.jpg",
        "path/to/image3.jpg",
      ]); // Replace with your actual image URLs
  
      fetchUserPosts();
      checkIfUserIsFollowing();
    }
}, [user]); 
useEffect(() => {
    if (user) {
      fetchUserPosts();
      checkIfUserIsFollowing();
    }
}, [user]);
useEffect(() => {
    if (user) {
      const fetchUserPosts = async () => {
        try {
          const postsRef = firebase.firestore().collection('products');
          const snapshot = await postsRef.where('userId', '==', user.uid).get();
          const userPostsData = snapshot.docs.map((doc) => doc.data());
          setUserPosts(userPostsData);
        } catch (error) {
          console.log('Error fetching user posts:', error);
        }
      };

      fetchUserPosts();
    }
}, [firebase, user]);
useEffect(() => {
    // Fetch the follower count from Firebase
    const fetchFollowerCount = async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = firebase.firestore().collection("users").doc(userId);

        userRef.onSnapshot((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setFollowerCount(userData.followerCount || 0);
          }
        });
      }
    };

    fetchFollowerCount();
}, [firebase]);
useEffect(() => {
    const updateMenuPosition = () => {
      if (iconRef.current && menuRef.current) {
        const iconHeight = iconRef.current.getBoundingClientRect().height;
        menuRef.current.style.bottom = `${iconHeight}px`;
      }
    };

    window.addEventListener('resize', updateMenuPosition);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
    };
}, []);
const fetchUserPosts = async () => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("products")
        .where("userId", "==", user.uid)
        .get();
      const userPosts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserPosts(userPosts);
    } catch (error) {
      console.log("Error getting user posts:", error);
    }
};
const checkIfUserIsFollowing = async () => {
    try {
      const response = await fetch(`/api/check-follow-status?userId=${user.id}`);
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
};
const handleSignOut = () => {
    firebase.auth().signOut();
};
const handleFollow = async () => {
    try {
      // Replace with your own logic to follow the user
      // Example:
      // await followUser(user.id);
      setIsFollowing(true);
      setFollowersCount((prevCount) => prevCount + 1);
      localStorage.setItem("isFollowing", "true");
      localStorage.setItem(
        "followersCount",
        (prevCount) => (prevCount ? prevCount : followersCount) + 1
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
};
const handleUnfollow = async () => {
    try {
      // Replace with your own logic to unfollow the user
      // Example:
      // await unfollowUser(user.id);
      setIsFollowing(false);
      setFollowersCount((prevCount) => prevCount - 1);
      localStorage.setItem("isFollowing", "false");
      localStorage.setItem(
        "followersCount",
        (prevCount) => (prevCount ? prevCount : followersCount) - 1
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
};
const handlePostClick = (post) => {
    setPostDetails(post);
};
const handleProfilePictureClick = () => {
    document.getElementById("profile-image-input").click();
};
  const getAvatarFromName = (name) => {
    if (name && name.length > 0) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=0D8ABC&color=fff&size=128`;
    }
    return null;
};
  const handleAutoSaveProfile = () => {
    if (newProfileImage) {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`profile_images/${user.uid}`);
      imageRef
        .putString(newProfileImage, "data_url")
        .then((snapshot) => {
          return snapshot.ref.getDownloadURL();
        })
        .then((downloadURL) => {
          firebase
            .auth()
            .currentUser.updateProfile({
              photoURL: downloadURL,
            })
            .then(() => {
              setProfilePicture(downloadURL);
              setNewProfileImage(null);
            })
            .catch((error) => {
              console.error("Error updating profile picture:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading profile image:", error);
        });
    }
};
const handleManualSaveProfile = () => {
    setNewDisplayName(displayName);
    setNewProfileImage(null);
    setIsEditing(false);
};
const handleUpdateProfile = () => {
  const currentUser = firebase.auth().currentUser;

  // Update display name
  currentUser
    .updateProfile({
      displayName: newDisplayName,
    })
    .then(() => {
      setDisplayName(newDisplayName);

      // Check if there is a new profile picture to upload
      if (newProfileImage) {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`profile_images/${currentUser.uid}`);

        // Upload the new profile picture
        imageRef
          .putString(newProfileImage, "data_url")
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((downloadURL) => {
            // Update profile picture in Firebase Authentication
            currentUser
              .updateProfile({
                photoURL: downloadURL,
              })
              .then(() => {
                setProfilePicture(downloadURL);
                setNewProfileImage(null);

                // Refresh the page after updating the profile
                window.location.reload();
              })
              .catch((error) => {
                console.error("Error updating profile picture:", error);
              });
          })
          .catch((error) => {
            console.error("Error uploading profile image:", error);
          });
      } else {
        // If there is no new profile picture, clear the current one
        currentUser
          .updateProfile({
            photoURL: null,
          })
          .then(() => {
            setProfilePicture(null);

            // Refresh the page after updating the profile
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error clearing profile picture:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
    });

  setIsEditing(false);
};
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const handleCartButtonClick = () => {
    setShowCart((prevShowCart) => !prevShowCart);
};
const handleRemoveFromCart = (item) => {
    const updatedCartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
};
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setNewProfileImage(reader.result);
        uploadProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
};
const uploadProfileImage = async (file) => {
    try {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`profile_images/${user.uid}`);
      const snapshot = await imageRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL,
      });
      setProfilePicture(downloadURL);
      setNewProfileImage(null);
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setIsUploading(false);
    }
};
const handleClick = () => {
    setShowDropdown(!showDropdown);
};
const handleDeletePost = async (productId) => {
  try {
    await firebase.firestore().collection("products").doc(productId).delete();
    fetchUserPosts();
  } catch (error) {
    console.log("Error deleting post:", error);
  }
};
const handleUpdate = () => {
console.log(productId)
}
return (
  <div className="pro">
    <div className="profile-info">
      <div className="profile-header">
        <div className="profile-picture-container">
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <img
            style={{ borderRadius: "50%" }}
            className="profile-avatar"
            src={newProfileImage || profilePicture}
            onClick={handleProfilePictureClick}
          />
          {isUploading && <div className="uploading-indicator">Uploading...</div>}
          {!isEditing && (
            <p className="edit-profile-icon" onClick={() => setIsEditing(true)}>
              Edit
            </p>
          )}
        </div>
        <br />
        <div className="profile-username-container">
          <div style={{ display: "flex", alignItems: "center" }}>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                />
                <button onClick={handleUpdateProfile}>Save</button>
              </>
            ) : (
              <>
                <h1 className="profile-username">
                  {displayName}
                  {displayName.length > 10 && (
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/flavory-beta.appspot.com/o/Assets%2FMobile%2Fverified.png?alt=media&token=f9e22e39-07f3-4e17-a643-bbc39d12a4bf&_gl=1*22e7ip*_ga*NzUzNTQwNjE3LjE2ODM5NzY1MjE.*_ga_CW55HF8NVT*MTY4NjQwOTk0Ni42My4xLjE2ODY0MTMwODUuMC4wLjA."
                      style={{ marginLeft: "5px", width: "20px", height: "20px" }}
                      alt="Verified"
                    />
                  )}
                </h1>
              </>
            )}
          </div>
        </div>  
        </div>
        <div className="len">
        <h4 className="follow-len">Followers <br /> <p style={{textAlign:"center"}}>{followerCount}</p></h4>
       <h4 className="post-len"> Posts <br /> <p style={{textAlign:"center"}}> {userPosts.length} </p></h4>
       <h4 className="following-len">Carted Items <br /> <p style={{textAlign:"center"}}>{followingCount}</p></h4>
       </div>
      </div>
      <div className="loca">
        
        <div className="uiverse" onClick={() => setShowCart(false)}>
          <span className="tooltip">Uploaded Posts</span>
          <span>Posts</span>
        </div>
        <div className="uiverse" onClick={() => setShowCart(true)}>
          <span className="tooltip">Carted Items</span>
          <span>Cart</span>
        </div>
      </div>
      {!showCart ? (
        <section className="card-container" >
           
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div>
              <div
                key={post.productId}
                className="card"
                style={{height:"400px"}}
              >
                <div className="card-image-2" style={{width:"100%"}}>
                  {post.url && (
                    <img src={post.url} alt="Post" className="card-image-1" />
                  )}
                </div>
                <div
                  className={`card-description-2 ${post.name.length > 20 ? 'long-name' : ''}`}               
                >
                  <p className={`card-name-2 ${post.name.length > 20 ? 'running-effect' : ''}`}>{post.name}</p>
                  <p>{post.createdAt}</p>
                  
               <div class="dropdown" >
  <FontAwesomeIcon
    icon={currentIcon}
    className="edit"
    style={{ fontSize: "20px", cursor: "pointer" ,marginRight:"-280px"}}
    onClick={handleClick}
    ref={iconRef}
  />
  <ul class="dropdown-menu dropdown-menu-up" ref={menuRef} >
    <li><a href="#"  onClick={handleUpdate}>Edit</a></li>
    <li><a href="#">Share</a></li>
    <li><a href="#" onClick={() => handleDeletePost(post.id)}>Delete</a></li>
  </ul>
</div>
    </div>
              </div>
              </div>
              
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </section>
      ) : (
        <section>
          <div>
            {showCart && (
              
              <div>
                 <img
          className="cart-icon"
          src={shoppingCartIcon}
          alt="Cart"
          onClick={handleCartButtonClick}
        />
                {cartItems.filter((item) => item.userId === user.uid).length >
                0 ? (
                  <section className="card-container">
                    {cartItems
                      .filter((item) => item.userId === user.uid)
                      .map((item) => (
                        <div key={item.id} className="card">
                          <div className="card-image">
                            {item.url && (
                              <img
                                src={item.url}
                                alt="Post"
                                className="post-image"
                              />
                            )}
                          </div>
                          <div
                            className={`card-description ${
                              item.name.length > 9 ? "long-name" : ""
                            }`}
                          >
                            <p className="card-name-2">{item.name}</p>
                            <button
                              onClick={() => handleRemoveFromCart(item)}
                            >
                              Remove
                            </button>
                          </div>
                          
                        </div>
                      ))}
                  </section>
                ) : (
                  <p style={{position:"relative",alignItems:"center",textAlign:"center"}}>No items in the cart.</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}
      <div>
       
        {cartItems.length > 0 && (
      <span></span>
        )}
      </div>
      <div className="profile-buttons">
      </div>
    </div>
  );
}

export default Profile;