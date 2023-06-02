import React, { useContext, useState, useEffect } from 'react';
import { UploaderContext } from './UploaderContext';

// ...

function Upload() {
  const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(AuthContext);
  const { setUploaderName } = useContext(UploaderContext);
  // ...
  
  useEffect(() => {
    if (user) {
      setUploaderName(user.displayName); // Set the uploaderName using the context
    }
  }, [user, setUploaderName]);
  
  // ...

  return (
    // ...
  );
}

export default Upload;
