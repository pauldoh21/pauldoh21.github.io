import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { ActivePostContext } from '../context/ActivePostContext';
import posts from '../posts/posts.json'; // Import posts data
import Gallery from './Gallery';
import ModalGallery from './ModalGallery';

function Post() {
  const { slug } = useParams(); // Get the slug from the URL
  const { activePost, setActivePost } = useContext(ActivePostContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper function to slugify a title (same logic as in Navbar.js)
  const slugify = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, '');   // Remove leading or trailing hyphens
  };

  // Update the active post based on the slug
  useEffect(() => {
    const post = posts.find((p) => slugify(p.title) === slug); // Find the post by slug
    if (post) {
      setActivePost(post); // Update the active post in context
    }
  }, [slug, setActivePost]);

  if (!activePost) return <p>Post not found</p>;

  // Helper function to render content blocks
  const renderContent = (contentArray) => {
    return contentArray.map((block, index) => {
      switch (block.type) {
        case 'h2':
          return <h2 key={index} className={block.className || {}}>{block.content}</h2>;

        case 'p':
          return (
            <p key={index} className={block.className || {}}>
              {block.content.map((item, i) => {
                if (item.type === 'text') {
                  return item.value.split('\n').map((line, j) => (
                    <React.Fragment key={`${i}-${j}`}>
                      {line}
                      {j < item.value.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ));
                } else if (item.type === 'link') {
                  return (
                    <a 
                      key={i} 
                      href={item.href} 
                      target={item.newTab ? "_blank" : undefined} 
                      rel={item.newTab ? "noopener noreferrer" : undefined}
                      className={block.className || {}}
                    >
                      {item.value}
                    </a>
                  );
                }
                return null;
              })}
            </p>
          );

        case 'ul':
          return (
            <ul key={index}>
              {block.content.map((item, i) => (
                <li key={i} className={block.className || {}}>{item}</li>
              ))}
            </ul>
          );

        case 'image':
          return (
            <img
              key={index}
              src={block.src}
              alt={block.alt}
              style={block.style || {}}
              className={block.className || {}}
              onClick={() => openModal(block.img_id)} // Open modal on click
            />
          );

        case 'Gallery':
          return (
            <div key={index} style={block.style || {}}>
              <Gallery>
                {block.images.map((image, i) => (
                  <img key={i} src={image.src} alt={image.alt} className={block.className || {}}/>
                ))}
              </Gallery>
            </div>
          );

        case 'div':
          return (
            <div key={index} style={block.style || {}} className={block.className || {}}>
              {renderContent(block.content)}
            </div>
          );

        default:
          return null;
      }
    });
  };

  // Helper function to recursively extract all images from content blocks
  const extractImages = (contentArray) => {
    let images = [];

    contentArray.forEach((block) => {
      if (block.type === 'image') {
        images.push(block.src); // Add the image source to the array
      } else if (block.type === 'div' || block.type === 'Gallery') {
        // Recursively search nested blocks
        images = images.concat(extractImages(block.content || block.images || []));
      }
    });

    return images;
  };

  // Use the helper function to get all images for the modal
  const allImages = extractImages(activePost.content);

  const openModal = (index) => {
    console.log('Opening modal for image index:', index);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div id="main" className="post-container">
      <div className="post-box">
        <h1>{activePost.title}</h1>
        {isModalOpen && (
          <ModalGallery
            index={currentImageIndex} // Pass the current image index to the modal
            images={allImages} // Pass all extracted images to the modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {activePost.is_ready ? (
          renderContent(activePost.content)
        ) : (
          <p>This post is currently a work in progress.</p>
        )}
      </div>
    </div>
  );
}

export default Post;
