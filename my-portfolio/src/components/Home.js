import React, { useContext, useEffect } from 'react';
import { ActivePostContext } from '../context/ActivePostContext';
import textFit from 'textfit';

function Home() {
  const { activePost } = useContext(ActivePostContext);

  useEffect(() => {
    const fitText = () => {
      const homeContainer = document.querySelector('.home-container');
      if (homeContainer && window.getComputedStyle(homeContainer).display === 'none') {
        return;
      }
  
      if (activePost) {
        textFit(document.querySelector('.cover-title'), {
          maxFontSize: 90,
          widthOnly: true,
        });
        textFit(document.querySelector('h1'), {
          maxFontSize: 120,
        });
      }
    };
  
    fitText(); // Apply text fit initially
    
    // Add resize event listener
    window.addEventListener('resize', fitText);
  
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', fitText);
    };
  }, [activePost]);
  

  return (
      <div id="main" className="home-container">
        <h1>Paul Doherty</h1>
        {activePost ? (
          <div>
            <div
              className="home-preview"
              style={{ backgroundImage: `url(${activePost.cover_image})` }}
            >
              <img
                className="cover-image"
                src={`/${activePost.cover_image}`}
                alt={`/${activePost.cover_image}`}
              />
              <h2 className="cover-title">{activePost.title}</h2>
            </div>
            <p>{activePost.description}</p>
          </div>
        ) : (
          <p>Select a post to view details.</p>
        )}
        
      </div>

  );
}

export default Home;

