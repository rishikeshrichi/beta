import React, { createContext, useState } from "react";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [postDetails, setPostDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [uploaderName, setUploaderName] = useState(""); // Fix the variable name

  return (
    <PostContext.Provider
      value={{
        postDetails,
        setPostDetails,
        userDetails,
        setUserDetails,
        uploaderName, // Include the correct variable name in the context value
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
