import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ActivePostContext } from '../context/ActivePostContext';  // Import the context
import Gallery from './Gallery';

function Post({ posts }) {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

  // Access the context to update the active post
  const { setActivePost } = useContext(ActivePostContext);

  // Update the active post when the component mounts or the ID changes
  useEffect(() => {
    if (post) {
      setActivePost(post);
    }
  }, [post, setActivePost]); // Dependencies ensure this runs when post changes

  if (!post) return <p>Post not found</p>;

  // Helper function to render content blocks
  const renderContent = (contentArray) => {
    return contentArray.map((block, index) => {
      switch (block.type) {
        case 'h2':
          return <h2 key={index}>{block.content}</h2>;

        case 'p':
          return (
            <p key={index}>
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
                    >
                      {item.value}
                    </a>
                  );
                }
                return null;
              })}
            </p>
          );

        case 'image':
          return (
            <img
              key={index}
              src={block.src}
              alt={block.alt}
              style={block.style || {}}
            />
          );

        case 'Gallery':
          return (
            <div style={block.style || {}}>
              <Gallery>
                {block.images.map((image, i) => (
                  <img key={i} src={image.src} alt={image.alt} />
                ))}
              </Gallery>
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div id="main" className="post-container">
      <h1>{post.title}</h1>
      {renderContent(post.content)}
    </div>
  );
}

export default Post;
