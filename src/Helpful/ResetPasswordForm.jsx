import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Toast } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FirebaseContext } from '../store/FirebaseContext';
import "./Reset.css"
import "../animation/Css/Form.scss"
function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { firebase } = useContext(FirebaseContext);
  const auth = firebase.auth();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    auth.sendPasswordResetEmail(email)
      .then(() => {
        setShowSuccessToast(true);
      })
      .catch((error) => {
        console.log(error);
        setShowErrorAlert(true);
      });
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
  return (
    <div style={{ right: '29px' }} className="container">
      <div className="img">
        <img src="https://i.ibb.co/JvXP8rW/phone.png" alt="" />
        <br />
      </div>
      <div className="reset-password-container">
        
        <form className="form-reset-password" onSubmit={handleResetPassword}>
          <img src="https://cdn-icons-png.flaticon.com/512/236/236832.png?w=826&t=st=1687425311~exp=1687425911~hmac=78ea9d4538b15449879005f672e27f5e26edc20536b7a17b66e5f849a04bb2ec" alt="" className='avatar' />
          <h2 className='rp'>Reset Password</h2>

          <div className="input-div one">
            <div className="i">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div>
              <h5>Email</h5>
              <input
                className="input"
                type="email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                onFocus={addcl}
                onBlur={remcl}
                
                required
              />
            </div>
          </div>

          <input type="submit" className="btn" value="Reset Password" />

          <Toast
            show={showSuccessToast}
            onClose={() => {
              setShowSuccessToast(false);
              navigate('/login'); // Navigate to the login page after successful password reset
            }}
            delay={2000}
            autohide
          >
            <Toast.Body>
              <FontAwesomeIcon style={{ top: '100px' }} icon={faCheckCircle} /> Password reset instructions sent to your email.
            </Toast.Body>
          </Toast>

          {showErrorAlert && (
            <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
              Failed to reset password. Please try again.
            </Alert>
          )}

          <Link to="/login" style={{ color: 'black' }} className="back-to-login">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
export default ResetPassword;
