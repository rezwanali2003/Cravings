import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Post from './Post';
import '../styles/Home.css';

const PostsList = ({ showSearch = false }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch posts data
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts/get/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="posts-container">
      {showSearch && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      )}

      <div className="posts-scroll">
        <AnimatePresence>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                whileHover={{ scale: 1.02, boxShadow: '0 12px 20px rgba(255, 99, 71, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="post-card"
              >
                <Post
                  postId={post.id}
                  title={post.title}
                  author={post.author}
                  content={post.content}
                  userId={post.user}
                  likes={post.like_count}
                  dislikes={post.dislike_count}
                  photo={post.photo}
                />
              </motion.div>
            ))
          ) : (
            <p className="no-posts">No posts found</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostsList;
