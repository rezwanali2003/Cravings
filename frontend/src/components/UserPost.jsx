import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPostManager from './UserPostManage';
import '../styles/Home.css';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/posts/user/', {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
          setLoading(false);
        } else {
          const result = await response.json();
          setError(result.error || 'Failed to fetch posts');
          setLoading(false);
        }
      } catch {
        setError('Error fetching user posts.');
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, []);

  if (loading) return <div className="loading-text">Loading posts...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="userposts-page">
      <header className="userposts-header">
        <button className="btn-create-post" onClick={() => navigate('/add-post')}>
          Create New Post
        </button>
        <button className="btn-go-back" onClick={() => navigate('/home')}>
          Go Back
        </button>
      </header>

      <h2 className="userposts-title">Your Posts</h2>

      {posts.length === 0 ? (
        <p className="no-posts-text">You haven't created any posts yet.</p>
      ) : (
        <section className="userposts-list">
          {posts.map((post) => (
            <UserPostManager key={post.id} {...post} />
          ))}
        </section>
      )}
    </div>
  );
};

export default UserPosts;
