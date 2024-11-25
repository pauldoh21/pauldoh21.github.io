import React from 'react';
import { useParams } from 'react-router-dom';

function Post({ posts }) {
  const { id } = useParams(); // Get the post ID from the URL
  const post = posts.find((p) => p.id === parseInt(id)); // Find the post with the matching ID

  let content;

  if (!post) {
    content = <p>Post not found</p>;
  } else {
    content = (
      <div>
        <h1>{post.title}</h1>
        {/* Use dangerouslySetInnerHTML for the content */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    );
  }

  return (
      <div id="main" className="post-container">
        {content}
      </div>
  );
}

export default Post;
