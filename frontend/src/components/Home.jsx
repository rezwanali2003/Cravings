import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const cravingsTitle = "CRAVINGS";

const Home = ({ onSignOut }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem('username');
  const [loadedLetters, setLoadedLetters] = useState(Array(cravingsTitle.length).fill(false));

  useEffect(() => {
    cravingsTitle.split('').forEach((_, idx) => {
      setTimeout(() => {
        setLoadedLetters(prev => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, 350 + idx * 180);
    });
  }, []);

  const handleSignOut = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.error('No refresh token found');
        return;
      }
      const response = await fetch('http://127.0.0.1:8000/api/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      });
      if (response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        onSignOut(false);
        navigate('/');
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.error);
      }
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <>
      {/* Removed duplicate navbar — using App.jsx navbar */}

      <div className="chain-hero-bg">
        <div className="cta-tagline">
          Share your cravings, revive recipes, and rediscover the tastes you’ll never forget.
        </div>

        <h1 className="cravings-chain-text wobble">
          {cravingsTitle.split('').map((letter, idx) => (
            <span
              key={idx}
              className={`craving-letter ${loadedLetters[idx] ? 'loaded' : ''}`}
              style={{ animationDelay: `${0.1 + idx * 0.25}s` }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <div className="welcome-username-hungry">
          <span>Welcome {user}</span>
        </div>

        <div className="post-cta-container">
          <button
            className="post-cta-button"
            onClick={() => navigate('/posts')}
          >
            See Posts
          </button>
          <div className="post-cta-caption">
            Feeling hungry? Explore delicious posts now!
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
