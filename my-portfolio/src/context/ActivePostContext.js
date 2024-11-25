import React, { createContext, useState } from 'react';
import posts from '../posts/posts.json';

// Create the context
export const ActivePostContext = createContext();

// Create a provider component
export const ActivePostProvider = ({ children }) => {
  const [activePost, setActivePost] = useState(posts[0]);

  return (
    <ActivePostContext.Provider value={{ activePost, setActivePost }}>
      {children}
    </ActivePostContext.Provider>
  );
};
