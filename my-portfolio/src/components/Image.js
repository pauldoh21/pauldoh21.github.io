import React, { useState } from 'react';
import ModalGallery from './ModalGallery';

function Image({ src, alt, index, block }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(index); // Set initial index based on the passed key
    

    
    return (
        <div>
        <img
            src={src}
            alt={alt}
            style={block.style || {}}
            className={block.className || {}}
            onClick={handleClick} // Open modal on click
        />
        <ModalGallery
            index={currentIndex}
            images={[src]} // Pass the image source to the modal
            isOpen={isOpen}
            onClose={handleClose}
        />
        </div>
    );
    }
    