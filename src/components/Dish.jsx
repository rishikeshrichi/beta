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
} from "@fortawesome/free-solid-svg-icons";

function RecipeDetails() {
  const navigate = useNavigate();
  const { firebase } = useContext(FirebaseContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { postDetails, setUserDetails } = useContext(PostContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (postDetails) {
      const { userId } = postDetails;
      const currentUser = firebase.auth().currentUser;

      if (currentUser) {
        const followRef = firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .collection("following")
          .doc(userId);

        followRef.get().then((doc) => {
          setIsFollowing(doc.exists);
        });
        const likeRef = firebase
        .firestore()
        .collection("likes")
        .doc(currentUser.uid)
        .collection("recipes")
        .doc(postDetails.recipeId);

      const dislikeRef = firebase
        .firestore()
        .collection("dislikes")
        .doc(currentUser.uid)
        .collection("recipes")
        .doc(postDetails.recipeId);

      likeRef.get().then((doc) => {
        setIsLiked(doc.exists);
      });

      dislikeRef.get().then((doc) => {
        setIsDisliked(doc.exists);
      });

      }

    

      if (postDetails && postDetails.userId) {
        const { userId } = postDetails;
        firebase
          .firestore()
          .collection('users')
          .where('id', '==', userId)
          .get()
          .then((res) => {
            res.forEach((doc) => {
              setUserDetails(doc.data());
            });
          });
      }

      const followerCountRef = firebase.firestore().collection("users").doc(userId);

      followerCountRef.onSnapshot((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setFollowerCount(userData.followerCount || 0);
        }
      });
      
      const userDetailsRef = firebase.firestore().collection("products").doc(userId);

      userDetailsRef
        .get()
        .then((doc) => {
          if (isMounted && doc.exists) {
            const data = doc.data();
            // Set the userDetails state using the setter function
            setUserDetails(data);
          }
        })
        .catch((error) => {
          console.error("Error getting user details:", error);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [firebase, navigate, postDetails, setUserDetails]);

  const incrementFollowerCount = (userId) => {
    const userRef = firebase.firestore().collection("users").doc(userId);

    userRef
      .update({
        followerCount: firebase.firestore.FieldValue.increment(1),
      })
      .then(() => {
        console.log("Successfully incremented follower count.");
      })
      .catch((error) => {
        console.log("Error incrementing follower count:", error);
      });
  };

  const decrementFollowerCount = (userId) => {
    const userRef = firebase.firestore().collection("users").doc(userId);

    userRef
      .update({
        followerCount: firebase.firestore.FieldValue.increment(-1),
      })
      .then(() => {
        console.log("Successfully decremented follower count.");
      })
      .catch((error) => {
        console.log("Error decrementing follower count:", error);
      });

    // After decrementing, check if the follower count is negative
    userRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const followerCount = userData.followerCount || 0;

        if (followerCount < 0) {
          // Set follower count to 0 if it's negative
          userRef
            .update({
              followerCount: 0,
            })
            .then(() => {
              console.log("Successfully set follower count to 0.");
            })
            .catch((error) => {
              console.log("Error setting follower count to 0:", error);
            });
        }
      }
    });
  };

  const handleFollowButtonClick = () => {
    const currentUser = firebase.auth().currentUser;
    const { userId } = postDetails;

    if (currentUser && !isLoading && !isButtonDisabled) {
      setIsLoading(true);
      setIsButtonDisabled(true); // Disable the button

      // Toggle the isFollowing state immediately
      setIsFollowing((prevIsFollowing) => !prevIsFollowing);

      console.log("Follow button clicked. isFollowing:", !isFollowing);

      if (isFollowing) {
        firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .collection("following")
          .doc(userId)
          .delete()
          .then(() => {
            decrementFollowerCount(userId);
            console.log("Successfully unfollowed the channel.");
          })
          .catch((error) => {
            console.log("Error unfollowing the channel:", error);
          })
          .finally(() => {
            setIsLoading(false);
            setIsButtonDisabled(false); // Enable the button
          });
      } else {
        firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .collection("following")
          .doc(userId)
          .set({})
          .then(() => {
            incrementFollowerCount(userId);
            console.log("Successfully followed the channel.");
          })
          .catch((error) => {
            console.log("Error following the channel:", error);
          })
          .finally(() => {
            setIsLoading(false);
            setIsButtonDisabled(false); // Enable the button
          });
      }
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

  const { name, url, ingredients, instructions,uploaderName} = postDetails;
  const handleLike = () => {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const likeRef = firebase
        .firestore()
        .collection("likes")
        .doc(currentUser.uid)
        .collection("recipes")
        .doc(postDetails.recipeId);

      if (isLiked) {
        likeRef
          .delete()
          .then(() => {
            setIsLiked(false);
          })
          .catch((error) => {
            console.log("Error removing like:", error);
          });
      } else {
        likeRef
          .set({})
          .then(() => {
            setIsLiked(true);

            // If the user previously disliked the recipe, remove the dislike
            if (isDisliked) {
              handleDislike();
            }
          })
          .catch((error) => {
            console.log("Error adding like:", error);
          });
      }
    }
  };

  const handleDislike = () => {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const dislikeRef = firebase
        .firestore()
        .collection("dislikes")
        .doc(currentUser.uid)
        .collection("recipes")
        .doc(postDetails.recipeId);

      if (isDisliked) {
        dislikeRef
          .delete()
          .then(() => {
            setIsDisliked(false);
          })
          .catch((error) => {
            console.log("Error removing dislike:", error);
          });
      } else {
        dislikeRef
          .set({})
          .then(() => {
            setIsDisliked(true);

            // If the user previously liked the recipe, remove the like
            if (isLiked) {
              handleLike();
            }
          })
          .catch((error) => {
            console.log("Error adding dislike:", error);
          });
      }
    }
  };

 const handleShare = () => {
    if (navigator.share) {
      
      navigator
        .share({
          title: "Recipe Details",
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
      console.log("Web Share API not supported");
      // You can provide a fallback sharing option here
    }
  };
//how to create random link for random recipes?
  return (
    <div className="dish">
      <Header />
      <div className="recipe-details">
        <div className="aside">
          <img style={{alignItems:"center",marginLeft:"10px",marginRight:"10px"}} src={url} alt={name} className="recipe-image" />
          <h1 className="recipe-title">{name}</h1>

           <div
            className="channel-row"
            style={{
              display: "flex",
              flexDirection: "wrap",
              alignItems: "center",
              color: "black",
              padding: "10px",
              borderRadius: "20px",
              marginBottom: "20px",
            }}
          >
          <img
                  src=""
                  alt="User Avatar"
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    border: "none",
                    borderColor: "black",
                  }}
                />
           <div style={{ flex: "1" }}>
              <div>
                <p className="uploader">{uploaderName}</p>
              </div>
              <p className="follow-count" style={{ marginBottom: "0", fontSize: "14px" ,color:"black"}} class="follow-count">
      {followerCount} Followers
      </p>
     
            </div>
            <button
              className="follow-button"
              style={{
                marginLeft: "10px",
                marginTop: "1%",
                padding: "8px 20px",
                color: "white",
                fontWeight: "bold",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                backgroundColor: isFollowing ? "gray" : "blue",
              }}
              onClick={handleFollowButtonClick}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="channel-row-2">
          <icon
          href="#"
              className="like-button"
              onClick={handleLike}
              style={{
                color: isLiked ? "blue" : "black",fontSize:"30px",marginLeft:"10px"
              }}
            >
              <FontAwesomeIcon icon={faThumbsUp} href="#"/>
            </icon>

            {/* Dislike button */}
            <icon
            href="#"
              className="dislike-button"
              onClick={handleDislike}
              style={{
                color: isDisliked ? "red" : "black", fontSize:"30px"
              }}
            >
              <FontAwesomeIcon icon={faThumbsDown} href="#" />
            </icon>

            {/* Share button */}
            <icon className="share-button" onClick={handleShare} style={{fontSize:"30px",marginLeft:"10px"}} href="#">
              <FontAwesomeIcon icon={faShare} href="#"/>
            </icon>
            <icon class="fa fa-cart-arrow-down" aria-hidden="true" style={{fontSize:"30px",marginRight:"10px"}} href="#"></icon>
          </div>
        </div>
        <div className="content">
          <section>
            <h2 className="section-title" style={{ textAlign: "center" ,width:"100%"}}>
              Ingredients
            </h2>
            <ul className="ingredient-list">
              {ingredients.split("\n").map((ingredient, index) => (
                <li className="ing" key={index}>{ingredient}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="section-title" style={{ textAlign: "center" }}>
              Instructions
            </h2>
            <ol className="instruction-list">
              {instructions.split(".").map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
