import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommentsModel from './CommentsModel';
import '../styles/Home.css';

// Using emoji as icons; replace with SVG/icon if needed
const ThumbsUp = ({ active }) => (
  <span style={{ color: active ? '#ff6d10' : '#ff8a3c', fontWeight: 'bold', fontSize: '1.5rem' }}>👍</span>
);
const ThumbsDown = ({ active }) => (
  <span style={{ color: active ? '#c24100' : '#ff8a3c', fontWeight: 'bold', fontSize: '1.5rem' }}>👎</span>
);

const Post = ({
  postId, title, author, content, userId,
  likes: initialLikes, dislikes: initialDislikes, photo
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [message, setMessage] = useState('');
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Your existing fetchInteractionStatus logic
  }, [postId]);

  const handleLike = async () => {
    // Your existing like logic
  };

  const handleDislike = async () => {
    // Your existing dislike logic
  };

  return (
    <div className="post-card">
      {photo && <img src={`http://127.0.0.1:8000${photo}`} alt="Post" className="post-photo" />}
      <h5 className="post-title">{title}</h5>
      <p className="post-content">{content}</p>
      <p className="post-author">
        Author:{' '}
        <span
          className="post-author-name"
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/user/${userId}`)}
          onKeyPress={e => { if (e.key === 'Enter') navigate(`/user/${userId}`); }}
        >
          {author}
        </span>
      </p>

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`btn-like ${isLiked ? 'active' : ''}`}
          aria-pressed={isLiked}
          title="Like"
        >
          <ThumbsUp active={isLiked} /> {likes}
        </button>

        <button
          onClick={handleDislike}
          className={`btn-dislike ${isDisliked ? 'active' : ''}`}
          aria-pressed={isDisliked}
          title="Dislike"
        >
          <ThumbsDown active={isDisliked} /> {dislikes}
        </button>

        <button
          onClick={() => setIsCommentsModalOpen(true)}
          className="btn-comments"
          title="Show Comments"
        >
          Comments
        </button>
      </div>

      {message && <small className="post-message">{message}</small>}

      {isCommentsModalOpen && (
        <CommentsModel postId={postId} onClose={() => setIsCommentsModalOpen(false)} />
      )}
    </div>
  );
};

export default Post;
