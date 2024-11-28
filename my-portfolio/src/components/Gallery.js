import React, { useState } from 'react';

const Gallery = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = React.Children.toArray(children); // Convert children to an array

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', textAlign: 'center', overflow: 'hidden' }}>
      <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
        {images.map((child, index) => (
          <div
            key={index}
            style={{
              display: index === currentIndex ? 'block' : 'none',
              width: '100%',
              height: '100%',
            }}
          >
            {React.cloneElement(child, {
              style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            })}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          zIndex: 1,
          padding: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          fontSize: '24px',
          border: 'none',
          borderRadius: '10%',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          zIndex: 1,
          padding: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          fontSize: '24px',
          border: 'none',
          borderRadius: '10%',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
      >
        &#10095;
      </button>
    </div>
  );
};

export default Gallery;
