import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Navbar.css';
import posts from '../posts/posts.json';
import { ActivePostContext } from '../context/ActivePostContext'; // Adjust path as needed

function Navbar({ type }) {
  const NAVBAR_VARIANTS = {
    1: 'navbar-landing',
    2: 'navbar-home',
    3: 'navbar-post',
  };

  const LOGO_VARIANTS = {
    1: '/powerButton.svg',
    2: '/logo.svg',
    3: '/logo.svg',
  };

  const LOGO_CSS_VARIANTS = {
    1: 'power-button',
    2: 'logo-big',
    3: 'logo-small',
  };

  const ITEM_VARIANTS = {
    1: { fontSize: '2rem' },
    2: { fontSize: '1.5rem' },
    3: { fontSize: '1rem' },
  };

  const { setActivePost } = useContext(ActivePostContext);
  const [activePage, setActivePage] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [circleRadius, setCircleRadius] = useState(type === 2 ? 25 :10); // Default radius
  
  const angleStep = 360 / posts.length;

  // Update circle radius based on window width
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 920 && type === 2) {
        setCircleRadius(50);
      } else if (type === 2) {
        setCircleRadius(25);
      } else if (type === 3) {
        setCircleRadius(10)
      }
    };

    updateRadius(); // Set radius on initial render
    window.addEventListener('resize', updateRadius); // Listen for window resize
    
    // Cleanup the event listener
    return () => window.removeEventListener('resize', updateRadius);
  }, [type]); // Re-run when type changes

  const rotateLeft = () => {
    setActivePage((prevPage) => {
      const newPage = prevPage === 1 ? posts.length : prevPage - 1;
      setPendingPost(posts[newPage - 1]);
      return newPage;
    });
    setRotation((prev) => prev + angleStep);
  };

  const rotateRight = () => {
    setActivePage((prevPage) => {
      const newPage = prevPage === posts.length ? 1 : prevPage + 1;
      setPendingPost(posts[newPage - 1]);
      return newPage;
    });
    setRotation((prev) => prev - angleStep);
  };

  const [pendingPost, setPendingPost] = useState(null);

  const handlePostClick = (post, index) => {
    setPendingPost(post);
    const targetPage = index + 1;
    setActivePage(targetPage);
    
    // Calculate the shortest rotation
    const delta = (targetPage - activePage + posts.length) % posts.length;
    const shortestRotation = delta <= posts.length / 2 ? delta : delta - posts.length;

    setRotation((prev) => prev - shortestRotation * angleStep);
  };

  useEffect(() => {
    if (pendingPost) {
      setActivePost(pendingPost);  // Update context after render completes
      setPendingPost(null);        // Clear pending state
    }
  }, [pendingPost, setActivePost]);

  return (
    <motion.div className={NAVBAR_VARIANTS[type]}>
      <motion.div animate={ITEM_VARIANTS[type]}>
        <Link to={type === 2 ? '/' : '/home'}>
          <input
            className={LOGO_CSS_VARIANTS[type]}
            type="image"
            src={LOGO_VARIANTS[type]}
            alt="Logo"
          />
        </Link>
      </motion.div>

      {type !== 1 && (
        <div className="navbar-circle">
          <motion.div
            className={`navbar-items${type === 3 ? ' post' : ''}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {posts.map((post, index) => {
              const classifyIndex = () => {
                const n = posts.length;
                const activeZeroIndexed = (activePage - 1) % n;

                if (index === activeZeroIndexed) return " active";
                if (index === (activeZeroIndexed + 1) % n) return "";
                if (index === (activeZeroIndexed - 1 + n) % n || index === (activeZeroIndexed + 2) % n) return " edge";
                return " invisible";
              };

              return (
                <Link key={post.id} className="navbar-link" to={`/post/${post.id}`}>
                  <motion.div
                    className={`navbar-item${classifyIndex()}${type === 3 ? ' post' : ''}`}
                    style={{
                      transform: `
                        translate(-50%, -50%)
                        rotate(${index * angleStep}deg)
                        translate(${circleRadius}vw)  /* Use dynamic circleRadius */
                        rotate(${ -index * angleStep - rotation }deg)
                      `
                    }}
                    onClick={(e) => {
                      const targetPage = index + 1;
                      if (targetPage !== activePage) {
                        e.preventDefault(); // Prevent default link navigation
                        handlePostClick(post, index);
                      }
                    }}
                  >
                    {post.title}
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>

          <input
            type="image"
            className={`scroll-button${type === 3 ? ' post' : ''} top`}
            src="/arrow.svg"
            alt="Up arrow"
            onClick={rotateLeft}
          />

          <input
            type="image"
            className={`scroll-button${type === 3 ? ' post' : ''} bottom`}
            src="/arrow.svg"
            alt="Down arrow"
            onClick={rotateRight}
          />
        </div>
      )}
    </motion.div>
  );
}

export default Navbar;
