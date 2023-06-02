import React, { createContext, useState } from "react";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [postDetails, setPostDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [uploaderName, setUploaderName] = useState(""); // Add the uploaderName state

  return (
    <PostContext.Provider
      value={{
        postDetails,
        setPostDetails,
        userDetails,
        setUserDetails,
        uploaderName, // Include the uploaderName state in the context value
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
