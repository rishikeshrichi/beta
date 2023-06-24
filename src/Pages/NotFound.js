import React, { Component } from 'react';
import { Route } from 'react-router-dom';

class NotFound extends Component {
  render() {
    return (
      <div>
        <h1>404 Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <p>Please try again or contact us for assistance.</p>
      </div>
    );
  }
}

export default NotFound;
