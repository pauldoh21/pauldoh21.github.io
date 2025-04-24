import React from 'react';
import ReactDOM from 'react-dom';
import './ModalGallery.css';

function ModalGallery({ index, images, isOpen, onClose }) {

  const [currentIndex, setCurrentIndex] = React.useState(index); // Set initial index based on the passed key

  console.log('Images:', images, 'Current Index:', currentIndex); // Debugging log

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || images.length === 0) {
    return null;
  }

const modalContent = (
    <div className="modal-gallery open" onClick={handleClose}>
        <button className="modal-close"></button>
        <div onClick={(e) => e.stopPropagation()} > 
            <button className="modal-prev" onClick={handlePrev}>
                    &#8249;
                </button>
            <button className="modal-next" onClick={handleNext}>
                &#8250;
        </button>
        </div>
        <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
        >
            
            <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
            
        </div>
    </div>
);

  return ReactDOM.createPortal(modalContent, document.body); // Render modal in <body>
}

export default ModalGallery;