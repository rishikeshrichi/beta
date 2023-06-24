import React, { useContext, useState, useEffect } from "react";
import { PostContext } from "../store/PostContext";
import "../animation/Css/Dish.css";
import Header from "../components/Header";
import Loader from "../animation/Loader";
import { useNavigate } from "react-router";
import { FirebaseContext } from "../store/FirebaseContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faThumbsUp,
faThumbsDown,
faShare,
faHeartCrack
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from 'react-router-dom';
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@material-ui/core";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RecipeDetails({recipeId,userId,postId,cartItems,user}) {
  const location                                  = useLocation();
  const postDetails                               = location.state?.postDetails || null;
  const navigate                                  = useNavigate();
  const { firebase }                              = useContext(FirebaseContext);
  const [isFollowing, setIsFollowing]             = useState(false);
  const [followerCount, setFollowerCount]         = useState(0);
  const [isLoading, setIsLoading]                 = useState(false);
  const [isButtonDisabled, setIsButtonDisabled]   = useState(false);
  const {  setUserDetails }                       = useContext(PostContext);
  const [profileImage, setProfileImage]           = useState(null);
  const [showFireworks, setShowFireworks]         = useState(false);
  const [likeCount, setLikeCount] = useState(() => {
    const storedCount                             = localStorage.getItem('likeCount');
    return parseInt(storedCount) || 0;
  });
  const [position, setPosition]                   = useState(0);
 const [isLiked, setIsLiked] = useState(false);
  const currentUser                               = firebase.auth().currentUser;
  const [showAlert, setShowAlert]                 = useState(false);
  const [containerWidth, setContainerWidth]       = useState(window.innerWidth);
  const animationDistance                         = 400; // Adjust this value as needed
  const animationSpeed                            = 1;
  const [dislikeCount, setDislikeCount]           = useState(0);
  const [isDisliked, setIsDisliked]               = useState(false);
  
useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
}, []);
useEffect(() => {
    let isMounted                 = true;
  
    if (postDetails) {
      const { userId }            = postDetails;
      const currentUser           = firebase.auth().currentUser;
  
      if (currentUser) {
        const followRef           = firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .collection("following")
          .doc(userId);
  
        followRef.get().then((doc) => {
          setIsFollowing(doc.exists);
        });
  
        const followerCountRef    = firebase
          .firestore()
          .collection("users")
          .doc(userId);
  
        followerCountRef.onSnapshot((doc) => {
          if (doc.exists) {
            const userData        = doc.data();
            setFollowerCount(userData.followerCount || 0);
          }
        });
  

        
  
      }
  
      if (postDetails && postDetails.userId) {
        const { userId }          = postDetails;
        firebase
          .firestore()
          .collection("users")
          .where("id", "==", userId)
          .get()
          .then((res) => {
            res.forEach((doc) => {
              setUserDetails(doc.data());
            });
          });
      }
  
      const followerCountRef      = firebase
        .firestore()
        .collection("users")
        .doc(userId);
  
      followerCountRef.onSnapshot((doc) => {
        if (doc.exists) {
          const userData          = doc.data();
          setFollowerCount(userData.followerCount || 0);
        }
      });
  
      const userDetailsRef        = firebase
        .firestore()
        .collection("products")
        .doc(userId);
  
      userDetailsRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData        = doc.data();
            setUserDetails(userData);
          }
        })
        .catch((error) => {
          console.log("Error getting user details:", error);
        });
    }
  
    const checkFollowingStatus = () => {
      const currentUser           = firebase.auth().currentUser;

      if (currentUser && postDetails && postDetails.userId) {
        const { userId }          = postDetails;

        const followRef           = firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .collection("following")
          .doc(userId);

        followRef.get().then((doc) => {
          if (isMounted) {
            setIsFollowing(doc.exists);
          }
        });
      }
    };
    checkFollowingStatus();
  
    return () => {
      isMounted                   = false;
    };
}, [firebase, postDetails, setUserDetails]);
useEffect(() => {
  if (postDetails && postDetails.userId) {
    const { userId }              = postDetails;
    const followerCountRef        = firebase
      .firestore()
      .collection("users")
      .doc(userId);

    followerCountRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData          = doc.data();
          setFollowerCount(userData.followerCount || 0);
        }
      })
      .catch((error) => {
        console.log("Error getting follower count:", error);
      });
  }
}, [firebase, postDetails]);
useEffect(() => {
  // Fetch the profile image URL from Firebase
  const fetchProfileImage = async () => {
    const recipeRef               = firebase.firestore().collection("recipes").doc(recipeId);
    const recipeSnapshot          = await recipeRef.get();

    if (recipeSnapshot.exists) {
      const recipeData            = recipeSnapshot.data();
      const userId                = recipeData.userId;

      const userRef               = firebase.firestore().collection("users").doc(userId);
      const userSnapshot          = await userRef.get();

      if (userSnapshot.exists) {
        const userData            = userSnapshot.data();
        setProfileImage(userData.profileImage || null);
      }
    }
  };

  fetchProfileImage();
}, [firebase, recipeId]);
useEffect(() => {
  // Function to check if the post is liked by the current user
  const checkLikedStatus = async () => {
    const currentUser             = firebase.auth().currentUser;
    if (currentUser) {
      const likeRef               = firebase.firestore().collection('likes').doc(postDetails?.id);
      const likeDoc               = await likeRef.get();
      setIsLiked(likeDoc.exists);
    }
  };

  // Fetch the like status when the component mounts
  checkLikedStatus();

  // Update likeCount in Firestore
  if (likeCount !== null && postDetails?.id) {
    const postRef                 = firebase.firestore().collection('likes').doc(postDetails?.id);
    postRef
      .update({ likeCount         : likeCount })
      .then(() => {
        console.log('likeCount updated in Firestore');
      })
      .catch((error) => {
        console.log('Error updating likeCount in Firestore:', error);
      });
  }
}, [likeCount, postDetails?.id]);
// Remove this useEffect
useEffect(() => {
  localStorage.setItem('likeCount', likeCount.toString());
}, [likeCount]);
useEffect(() => {
  localStorage.setItem('likeCount', likeCount.toString());
}, [likeCount]);
useEffect(() => {
  if (postDetails) {
    const { postId }              = postDetails;

    const dislikeCountRef         = firebase
      .firestore()
      .collection("dislikes")
      .doc(postId)
      .collection("users");

    // Subscribe to changes in the "users" subcollection of the post's document
    const unsubscribe = dislikeCountRef.onSnapshot((snapshot) => {
      // Update the dislike count based on the number of documents in the subcollection
      setDislikeCount(snapshot.size);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }
}, [firebase, postDetails]);
const incrementLikeCount = () => {
  setLikeCount((prevCount) => prevCount + 1);
};
const incrementFollowerCount = (userId) => {
  setIsFollowing(true);

  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .update({
      followerCount: firebase.firestore.FieldValue.increment(1)
    })
    .catch((error) => {
      console.log("Error incrementing follower count: ", error);
    });
};
const decrementFollowerCount = (userId) => {
  setIsFollowing(false);

  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const currentCount = doc.data().followerCount;
        const newCount = Math.max(0, currentCount - 1);

        return firebase
          .firestore()
          .collection("users")
          .doc(userId)
          .update({
            followerCount: newCount
          });
      }
    })
    .catch((error) => {
      console.log("Error decrementing follower count: ", error);
    });
};
const handleFollowButtonClick = () => {
  
  setIsLoading(true);
  setIsButtonDisabled(true);

  const currentUser = firebase.auth().currentUser;
  
  const { userId } = postDetails;
  if (!currentUser) {
    toast.error('Please log in to follow the user.');
    setIsLoading(false);
    setIsButtonDisabled(false);
    return;
  }
  const followRef = firebase
    .firestore()
    .collection("users")
    .doc(currentUser.uid)
    .collection("following")
    .doc(userId);

  const followerRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  if (isFollowing) {
    followRef
      .delete()
      .then(() => {
        setIsFollowing(false);
        decrementFollowerCount();
        setIsLoading(false);
        setIsButtonDisabled(false);
      })
      .catch((error) => {
        console.error("Error unfollowing user:", error);
        setIsLoading(false);
        setIsButtonDisabled(false);
      });

    followerRef
      .update({
        followerCount: firebase.firestore.FieldValue.increment(-1),
      })
      .catch((error) => {
        console.error("Error updating follower count:", error);
      });
  } else {
    followRef
      .set({
        userId: userId,
      })
      .then(() => {
        setIsFollowing(true);
        incrementFollowerCount();
        setIsLoading(false);
        setIsButtonDisabled(false);
      })
      .catch((error) => {
        console.error("Error following user:", error);
        setIsLoading(false);
        setIsButtonDisabled(false);
      });

    followerRef
      .update({
        followerCount: firebase.firestore.FieldValue.increment(1),
      })
      .catch((error) => {
        console.error("Error updating follower count:", error);
      });
  }
};
if (!postDetails || !postDetails.name || !postDetails.ingredients || !postDetails.instructions || !postDetails.uploaderName) {
  return (
    <div>
      <Loader />
      <div className="error">Loading...</div>
    </div>
  );
}

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${postDetails.name}`,
          text: `Check out this recipe: ${postDetails.name}`,
          url: window.location.href,
        })
        .then(() => {
          console.log("Share successful");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      // Fallback: Display a share dialog
      const shareUrl = window.location.href;
      const shareTitle = `${postDetails.name}`;
      const shareText = `Check out this recipe: ${postDetails.name}`;

      // Create a share dialog element
      const shareDialog = document.createElement("div");
      shareDialog.className = "share-dialog";

      // Create the content of the share dialog
      const shareContent = document.createElement("div");
      shareContent.className = "share-content";

      const shareTitleElement = document.createElement("h3");
      shareTitleElement.innerText = "Share Recipe";

      const shareTextElement = document.createElement("p");
      shareTextElement.innerText = shareText;

      const shareLinkElement = document.createElement("a");
      shareLinkElement.href = shareUrl;
      shareLinkElement.innerText = "Copy Link";

      // Append elements to the share dialog
      shareContent.appendChild(shareTitleElement);
      shareContent.appendChild(shareTextElement);
      shareContent.appendChild(shareLinkElement);
      shareDialog.appendChild(shareContent);

      // Append the share dialog to the document body
      document.body.appendChild(shareDialog);
    }
  };
const { name, url, ingredients, instructions, uploaderName, profilePicture } = postDetails;
const handleLikeButtonClick = async () => {
  if (!currentUser) {
    // User is not logged in
    toast.warning('Please log in to like the post.',{
      backgroundColor:"red",
      
    })
    return;
  }

  if (isLiked) {
    // Unlike post
    setIsLiked(false);
    setLikeCount(likeCount - 1);

    // Remove like from Firestore
    const likeRef = firebase.firestore().collection('likes').doc(postDetails?.id);
    likeRef
      .delete()
      .then(() => {
        console.log('Like removed from Firestore');
      })
      .catch((error) => {
        console.log('Error removing like from Firestore:', error);
      });

    // Update likeCount in Firestore
    const postRef = firebase.firestore().collection('posts').doc(postDetails?.id);
    postRef
      .update({ likeCount: likeCount - 1 })
      .then(() => {
        console.log('likeCount updated in Firestore');
      })
      .catch((error) => {
        console.log('Error updating likeCount in Firestore:', error);
      });
  } else {
    // Like post
    setIsLiked(true);
    setLikeCount(likeCount + 1);

    // Add like to Firestore
    const likeRef = firebase.firestore().collection('likes').doc(postDetails?.id);
    likeRef
      .set({ userId: currentUser?.uid })
      .then(() => {
        console.log('Like added to Firestore');
      })
      .catch((error) => {
        console.log('Error adding like to Firestore:', error);
      });

    // Update likeCount in Firestore
    const postRef = firebase.firestore().collection('posts').doc(postDetails?.id);
    postRef
      .update({ likeCount: likeCount + 1 })
      .then(() => {
        console.log('likeCount updated in Firestore');
      })
      .catch((error) => {
        console.log('Error updating likeCount in Firestore:', error);
      });
  }
};
const handleLike = () => {
  if (!currentUser) {
    // User is not logged in
    toast.warning('Please log in to like the post.');
    return;
  }

  if (isLiked) {
    // Unlike post
     setIsLiked(!isLiked);
    setLikeCount(likeCount - 1);

    // Remove like from Firestore
    const likeRef = firebase.firestore().collection('likes').doc(postDetails?.id);
    likeRef
      .delete()
      .then(() => {
        console.log('Like removed from Firestore');
      })
      .catch((error) => {
        console.log('Error removing like from Firestore:', error);
      });

    // Update likeCount in Firestore
    const postRef = firebase.firestore().collection('likes').doc(postDetails?.id);
    postRef
      .update({ likeCount: likeCount - 1 })
      .then(() => {
        console.log('likeCount updated in Firestore');
      })
      .catch((error) => {
        console.log('Error updating likeCount in Firestore:', error);
      });
  } else {
    // Like post
    setIsLiked(true);
    setLikeCount(likeCount + 1);

    // Add like to Firestore
    const likeRef = firebase.firestore().collection('likes').doc(postDetails?.id);
    likeRef
      .set({ userId: currentUser?.uid })
      .then(() => {
        console.log('Like added to Firestore');
      })
      .catch((error) => {
        console.log('Error adding like to Firestore:', error);
      });

    // Update likeCount in Firestore
    const postRef = firebase.firestore().collection('likes').doc(postDetails?.id);
    postRef
      .update({ likeCount: likeCount + 1 })
      .then(() => {
        console.log('likeCount updated in Firestore');
      })
      .catch((error) => {
        console.log('Error updating likeCount in Firestore:', error);
      });
  }
};
const decrementLikeCount = (postId) => {
  firebase
    .firestore()
    .collection("posts")
    .doc(postId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const currentCount = doc.data().likeCount;
        const newCount = Math.max(0, currentCount - 1);

        return firebase
          .firestore()
          .collection("posts")
          .doc(postId)
          .update({
            likeCount: newCount
          });
      }
    })
    .catch((error) => {
      console.log("Error decrementing like count: ", error);
    });
};
const handleDeletePost = () => {
  if (window.confirm("Are you sure you want to delete this post?")) {
    setIsLoading(true);
    setIsButtonDisabled(true);

    const postRef = firebase.firestore().collection("posts").doc(postId);

    postRef
      .delete()
      .then(() => {
        setIsLoading(false);
        setIsButtonDisabled(false);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setIsButtonDisabled(false);
      });
  }
};
const handleEditPost = () => {
  navigate(`/edit-post/${postId}`);
};
const addToCart = () => {
  if (user) {
    const cartItem = {
      userId: user.uid,
      // Add relevant cart data here (e.g., item details, quantity, etc.)
    };

    // Get a reference to the Firestore collection
    const cartsCollection = firebase.firestore().collection("carts");

    // Add the cart item to the collection
    cartsCollection
      .add(cartItem)
      .then(() => {
        console.log("Cart item added to Firestore");
      })
      .catch((error) => {
        console.error("Error adding cart item to Firestore: ", error);
      });
  }
};
const handleDislike = () => {
  if (!currentUser) {
    // User is not logged in
    toast.warning('Please log in to dislike the post.');
    return;
  }

  // Create references to the "likes" and "dislikes" collections in Firestore
  const likeRef = firebase.firestore().collection('likes').doc(postDetails?.id);
  const dislikeRef = firebase.firestore().collection('dislikes').doc(postDetails?.id);

  if (isDisliked) {
    // Undislike post
    setIsDisliked(false);
    setDislikeCount(dislikeCount - 1);

    // Remove dislike from Firestore
    dislikeRef.delete()
      .then(() => {
        console.log('Dislike removed from Firestore');
      })
      .catch((error) => {
        console.log('Error removing dislike from Firestore:', error);
      });

    // Update dislikeCount in Firestore
    const postRef = firebase.firestore().collection('posts').doc(postDetails?.id);
    postRef.update({ dislikeCount: dislikeCount - 1 })
      .then(() => {
        console.log('dislikeCount updated in Firestore');
      })
      .catch((error) => {
        console.log('Error updating dislikeCount in Firestore:', error);
      });
  } else {
    // Check if the user has already liked the post
    likeRef.get().then((likeDoc) => {
      if (likeDoc.exists) {
        const { userId } = likeDoc.data();
        // Check if the user's ID matches the current user's ID
        if (userId === currentUser.uid) {
          // User has already liked the post, remove the like
          likeRef.delete()
            .then(() => {
              console.log('Like removed from Firestore');
            })
            .catch((error) => {
              console.log('Error removing like from Firestore:', error);
            });
        }
      }

      // Dislike post
      setIsDisliked(true);
      setDislikeCount(dislikeCount + 1);

      // Add dislike to Firestore
      dislikeRef.set({ userId: currentUser?.uid })
        .then(() => {
          console.log('Dislike added to Firestore');
        })
        .catch((error) => {
          console.log('Error adding dislike to Firestore:', error);
        });

      // Update dislikeCount in Firestore
      const postRef = firebase.firestore().collection('posts').doc(postDetails?.id);
      postRef.update({ dislikeCount: dislikeCount + 1 })
        .then(() => {
          console.log('dislikeCount updated in Firestore');
        })
        .catch((error) => {
          console.log('Error updating dislikeCount in Firestore:', error);
        });
    });
  }
};
 const dislikeButtonStyle = {
    color: isDisliked ? 'red' : 'black',
};
  return (
  <div className                        = "dish">
    <Header />
    <div className                      = "recipe-details">
      <div className                    = "aside">
        <section class                  = "img-holder">
          <img src                      = {url} alt={name} className="recipe-image" />
        </section>
        <div className                  = "dish-card">
          <div className                = "recipe-name-container" style={{ overflow: 'hidden' }}>
     <h2 className                      = {`recipe-name ${name.length > 14 ? 'long-name' : ''}`} data-text="">
  {name}
</h2>
    </div>
     </div>

        <div className                  = "channel-row" style={{ display: "flex", flexDirection: "wrap", alignItems: "center", color: "black", padding: "10px", borderRadius: "20px", marginBottom: "20px" }}>
          <Avatar
            src                         = {profilePicture}
            alt                         = "User Avatar"
            style                       = {{ height: "60px", width: "60px", borderRadius: "50%", border: "none", borderColor: "black", marginLeft:"10px"}}
            className                   = "pro-ava"
          />
          <div style                    = {{ flex: "1" }}>
            <div>
              <p className              = "uploader">{uploaderName}</p>
            </div>
            <p className                = "follow-count" style={{ marginBottom: "0", fontSize: "14px", color: "black" }} class="follow-count">
              {followerCount} Followers
            </p>
          </div>
          <button
            className                   = "follow-button"
            onClick                     = {handleFollowButtonClick}
            disabled                    = {isButtonDisabled} // Disable the button during loading state
            style={{
              marginLeft                : "10px",
              padding                   : "8px 20px",
              color                     : "white",
              fontWeight                : "bold",
              borderRadius              : "20px",
              border                    : "none",
              cursor                    : "pointer",
              backgroundColor           : isFollowing ? "gray" : "blue",
              marginTop                 : "-4px",
            }}
          >
            {isFollowing ? "Unfollow"   : "Follow"}
          </button>
        </div>

        <div className                  = "channel-row-2" >
          <div className                = "count-like">
            <icon className             = {`heart-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
              <FontAwesomeIcon icon     = {faHeart} className="heart-button" style={{ marginTop: "10px", position: "absolute" }} />
            </icon>

            <br />
            <p className                = "like-count" style={{ visibility: "hidden" }}>{likeCount}</p>
          </div>
          <FontAwesomeIcon icon         = {faHeartCrack} onClick={handleDislike} className="dislike" style={dislikeButtonStyle} />

          {/* Share button */}
          <icon className               = "share-button" onClick={handleShare} style={{ fontSize: "30px", marginTop: "-6px", cursor: "pointer" }} href="#">
            <FontAwesomeIcon icon       = {faShare} href="#" />
          </icon>
          <cart class                   = "fa fa-cart-arrow-down" aria-hidden="true" style={{ fontSize: "30px", marginTop: "-4px" }} href="#" onClick={addToCart}></cart>
          {currentUser && userId === currentUser.uid && (
            <div>
              <button onClick= {handleEditPost}>Edit</button>
              <button onClick           = {handleDeletePost}>Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className                    = "content">
        <section>
          <h2 className                 = "section-title" style={{ textAlign: "center", width: "100%" }}>
            Ingredients
          </h2>
          <ul className                 = "ingredient-list">
            {ingredients.split("\n").map((ingredient, index) => (
              <li className             = "ing" key={index}>{ingredient}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className= "section-title" style={{ textAlign: "center" }}>
            Instructions
          </h2>
          <ol className                 = "instruction-list">
            {instructions.split(".").map((step, index) => (
              <li key= {index}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  </div>
);
}

export default RecipeDetails;