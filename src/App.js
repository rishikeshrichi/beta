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
import {PostProvider} from './store/PostContext';
import UploaderPage from './Pages/UploaderPage'
function App() {
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
              <Route path="/view/:recipeId" element={<View />} />
              <Route path="/user/:uploaderName" component={UploaderPage} />
            </Routes>
          </Router>
        </PostProvider >
      )}
    </div>
  );
}
export default App;
