import React, { useState, useContext } from 'react';
import '../animation/Css/Form.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../store/FirebaseContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUpForm() {
  const navigate = useNavigate();
  const { firebase } = useContext(FirebaseContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const addcl = (event) => {
    event.target.parentNode.parentNode.classList.add('focus');
  };

  const remcl = (event) => {
    if (event.target.value === '') {
      event.target.parentNode.parentNode.classList.remove('focus');
    }
  };

  const handleUsernameChange = (event) => {
    const enteredValue = event.target.value.trim();
    const validValue = enteredValue.replace(/[^a-zA-Z0-9]/gi, '').substr(0, 10);
    setUsername(validValue);

    // Check if the entered value is a valid email
    const enteredEmail = enteredValue;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enteredEmail)) {
      setEmail(enteredEmail);
    } else {
      setEmail('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const auth = firebase.auth();
      const firestore = firebase.firestore();

      // Create a user with email and password
      await createUserWithEmailAndPassword(auth, email, password);

      // Update the user profile with the username
      const currentUser = auth.currentUser;
      await updateProfile(currentUser, { displayName: username });

      // Store the user details in Firestore
      const newUser = {
        userId: currentUser.uid,
        username: username,
        email: email,
      };
      await addDoc(collection(firestore, 'users'), newUser);

      toast.success('Account Created', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'toast-success',
        bodyClassName: 'toast-body',
        progressClassName: 'toast-progress',
      });

      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div style={{ right: '29px' }} className="container">
      <div className="img">
        <img src="https://i.ibb.co/JvXP8rW/phone.png" alt="" />
        <br />
      </div>
      <div className="login-container">
        <form className="form-login">
          <img className="avatar" src="https://i.ibb.co/H4f3Hkv/profile.png" alt="" />
          <br />
          <br />
          <h3 className="wf">Welcome To TastyTrends</h3>
          <br />          <div className="input-div one">
            <div className="i">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <h5>Username</h5>
              <input
                className="input"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onFocus={addcl}
                onBlur={remcl}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="input-div">
            <div className="i">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div>
              <h5>Email</h5>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={addcl}
                onBlur={remcl}
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
                onChange={(event) => setPassword(event.target.value)}
                onFocus={addcl}
                onBlur={remcl}
              />
            </div>
          </div>
          <input onClick={handleSubmit} type="submit" className="btn" value="SignUp" />
          <a href="login"  onClick={() => navigate('/login')} className="already">
            Already Have an Account
          </a>
          <div className="social-login"></div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default SignUpForm;