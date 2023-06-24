import './App.css';
import Home from './Pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useContext, useState } from 'react';
import { AuthContext, FirebaseContext } from './store/FirebaseContext';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import SignUp from './Pages/SignUp';
import Upload from './Pages/Upload';
import Loader from './animation/Loader';
import View from './Pages/View';
import { PostProvider } from './store/PostContext';
import UploaderPage from './Pages/UploaderPage'
import RecipeDetails from './components/Dish';
import { Helmet } from 'react-helmet';
import Ads from './Ads.txt';
import NotFound from './Pages/NotFound';
import { ToastContainer } from 'react-toastify';
import ResetPasswordForm from './Helpful/ResetPasswordForm';
import { PostContext } from './store/PostContext';
import EditRecipe from './Helpful/EditRecipe';
function App({post}) {
  const { setUser } = useContext(AuthContext);
  const { firebase } = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, [firebase, setUser]);

  return (
    <div className="App">
      <Helmet>
        <p>{Ads}</p>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7897001352223212"
          crossorigin="anonymous"
        ></script>
      </Helmet>
      {isLoading ? (
        <Loader />
      ) : (
        <PostProvider>
          <Router>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/view" element={<RecipeDetails />} />
              <Route path="/user/:uploaderName" component={UploaderPage} />
              <Route path="*" component={NotFound} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/edit-product/:productId" element={<EditRecipe />} />
            </Routes>
          </Router>
          <ToastContainer />
        </PostProvider>
      )}
    </div>
  );
}

export default App;
