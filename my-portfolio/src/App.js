import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home';
import Post from './components/Post';
import NavbarController from './components/Navbar';
import Background from './components/Background';
import './App.css'; // Ensure the correct path
import posts from './posts/posts.json'
import { ActivePostProvider } from './context/ActivePostContext'; // Adjust path as needed


function NavbarSelector() {
  const location = useLocation();

  // Determine navbar type based on current route
  const navbarType = (() => {
    if (location.pathname === '/') return 1; // Landing page
    if (location.pathname.startsWith('/home')) return 2; // Home page
    if (location.pathname.startsWith('/post')) return 3; // Post page
    return 2; // Default type
  })();

  return <NavbarController type={navbarType} />;
}

function App() {
  return (
    <ActivePostProvider>
      <Router>
        {/* Consider creating background component for all pages */}
        <NavbarSelector />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/post/:id" element={<Post posts={posts} />} />
        </Routes>
      <Background />
      </Router>
    </ActivePostProvider>
  );
}

export default App;
