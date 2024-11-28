import React from 'react';
import { useParams } from 'react-router-dom';
import Gallery from './Gallery';

function Post({ posts }) {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

  if (!post) return <p>Post not found</p>;

  // Helper function to render content blocks
  const renderContent = (contentArray) => {
    return contentArray.map((block, index) => {
      switch (block.type) {
        case 'h2':
          return <h2 key={index}>{block.content}</h2>;
        case 'p':
          // Split content on \n and map each line
          const lines = block.content.split('\n');
          return (
            <p key={index}>
              {lines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
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
