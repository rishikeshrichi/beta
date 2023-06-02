import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/FirebaseContext";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { FaEdit } from "react-icons/fa";
import "./Profile.css";
import { navigate, useNavigate } from "react-router-dom";
import { PostContext } from "../store/PostContext";
import shoppingCartIcon from '../animation/Asset/icons8-cart.gif';
import { FirebaseContext } from '../store/FirebaseContext';

function Profile() {
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

  const fetchUserPosts = async () => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("posts")
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
    navigate(`/view`);
  };

  const handleProfilePictureClick = () => {
    document.getElementById("profile-image-input").click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
    firebase.auth().currentUser.updateProfile({
      displayName: newDisplayName,
    })
    .then(() => {
      setDisplayName(newDisplayName);
      handleAutoSaveProfile(); // Call handleAutoSaveProfile to save the changes
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

  return (
    <div>
      <a
        className="fa fa-arrow-left"
        aria-hidden="true"
        style={{ fontSize: "30px", marginLeft: "10px", marginTop: "10px" }}
        onClick={() => {
          navigate("/");
        }}
      ></a>
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
              src={newProfileImage || getAvatarFromName(displayName)}
              alt="Profile Avatar"
              onClick={handleProfilePictureClick}
            />
            {!isEditing && (
              <p
                className="edit-profile-icon"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </p>
            )}
          </div>
          <br />
          <div className="profile-username-container">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                />
                <br />
                <button onClick={handleUpdateProfile}>Save</button>
              </>
            ) : (
              <>
                <h1 className="profile-username">{displayName}</h1>
                {isFollowing ? (
                  <button
                    className="following-button"
                    style={{ borderRadius: "50px" }}
                    onClick={handleUnfollow}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="follow-button"
                    style={{ borderRadius: "50px" }}
                    onClick={handleFollow}
                  >
                    Follow
                  </button>
                )}
              </>
            )}
          </div>
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
        <section className="card-container">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div
                key={post.id}
                className="card"
                onClick={() => handlePostClick(post)}
              >
                <div className="card-image">
                  {post.url && (
                    <img src={post.url} alt="Post" className="post-image" />
                  )}
                </div>
                <div
                  className={`card-description ${
                    post.name.length > 9 ? "long-name" : ""
                  }`}
                >
                  <p className="card-name-2">{post.name}</p>
                  <p>{post.createdAt}</p>
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
                  <p>No items in the cart.</p>
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
