import "../animation/Css/Form.scss";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { Navigate, useNavigate } from "react-router";
import { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "../store/FirebaseContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Toast } from 'react-bootstrap';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
function LoginForm() {
  const navigate = useNavigate("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const { firebase } = useContext(FirebaseContext);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleUsernameChange = (event) => {
    setEmail(event.target.value);
  };
  const [email, setEmail] = useState(auth.currentUser ? auth.currentUser.email : "");
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const addcl = (event) => {
    let parent = event.target.parentNode.parentNode;
    parent.classList.add("focus");
  };

  const remcl = (event) => {
    let parent = event.target.parentNode.parentNode;
    if (event.target.value === "") {
      parent.classList.remove("focus");
    }
  };
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setShowSuccessToast(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  
  

  const reset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileImage(userData.profileImage);
      }
    };

    if (auth.currentUser) {
      fetchUserProfileImage();
    }
  }, [auth.currentUser, db]);

  return (
    <div style={{ right: "29px" }} className="container">
      <div className="img">
        <img src="https://i.ibb.co/JvXP8rW/phone.png" alt="" />
        <br />
      </div>
      <div className="login-container">
        <form className="form-login" action="index.html">
          {profileImage && (
            <img className="avatar" src={profileImage} alt="Profile" />
          )}

          <h2>Welcome</h2>

          <br />
          <div className="input-div one">
            <div className="i">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <h5>Email</h5>
              <input
                className="input"
                type="email"
                value={email}
                onChange={handleUsernameChange}
                onFocus={addcl}
                onBlur={remcl}
                autoComplete="email"
              />
            </div>
          </div>
          <div className="input-div pass">
            <div className="i">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <div className="div">
              <h5>Password</h5>
              <input
                className="input"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={addcl}
                onBlur={remcl}
                autocomplete="current-password"
              />
            </div>
          </div>
          <input
            onClick={handleLogin}
            type="submit"
            className="btn"
            value="Login"
          />
          <Toast
            show={showSuccessToast}
            onClose={() => setShowSuccessToast(false)}
            delay={2000}
            autohide
          >
            <Toast.Body>
              <FontAwesomeIcon style={{ top: "100px" }} icon={faCheckCircle} />{" "}
              Logged In
            </Toast.Body>
          </Toast>
          {showErrorAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowErrorAlert(false)}
              dismissible
            >
              <FontAwesomeIcon icon={faExclamationTriangle} /> Login failed.
              Please try again.
            </Alert>
          )}
          <Link to="/reset-password" className="forgot-password">
            Forgot Password?
          </Link>
          <a onClick={() => navigate("/signup")} className="already">
            Create New Account
          </a>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;

