import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import '../animation/Css/main.css';
import React, { useContext } from 'react';
import { AuthContext, FirebaseContext } from '../store/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../animation/Css/Style.css';

function Header() {
  const { user } = useContext(AuthContext);
  const { firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.log('Logout error:', error);
      });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="sm" >
      <Container fluid>
        <Navbar.Brand style={{ color: 'Yellow', fontSize: '17px', marginLeft: '1px' }} className="Brand" href="#" onClick={()=>{navigate("/")}}>
          Tasty<span style={{color:"white"}} onClick={()=>{navigate("/")}}>Trends</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link className='navLink' onClick={() => navigate('/')}>Home</Nav.Link>
                <Nav.Link className='navLink' onClick={() => navigate('/profile')}>
  {user.displayName}
</Nav.Link>

                <Nav.Link className='navLink' onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
            )}
            <a class="codepen-button"  onClick={() => navigate('/upload')}>
              <span >Upload</span>
            </a>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
