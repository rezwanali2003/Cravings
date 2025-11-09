import React, { useState, useEffect } from 'react';

const CommentsModal = ({ postId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/comments/`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Add a New Comment
  const handleAddComment = async () => {
    const accessToken = localStorage.getItem('accessToken');
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/add-comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="modal-content"
        style={{
          background: '#fff',
          borderRadius: '8px',
          width: '50%',
          padding: '20px',
          maxHeight: '80%',
          overflowY: 'auto',
        }}
      >
        <div className="modal-header">
          <h5>Comments</h5>
          <button
            className="btn-close"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-3">
              <strong>{comment.author_username}</strong>
              <p>{comment.content}</p>
              <hr />
            </div>
          ))}
          <textarea
            className="form-control"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="btn btn-primary mt-2"
            onClick={handleAddComment}
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
