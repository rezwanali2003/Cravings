import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, handleLogout }) {
  return (
    <nav
      style={{
        backgroundColor: '#000',
        color: '#ff4a00',
        padding: '1rem',
        fontFamily: "'Creepster', cursive",
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
      className="main-navbar"
    >
      <Link to="/home" style={{ marginRight: '1rem', color: '#ff4a00', textDecoration: 'none' }}>Home</Link>
      <Link to="/posts" style={{ marginRight: '1rem', color: '#ff4a00', textDecoration: 'none' }}>Posts</Link>
      <Link to="/user-post" style={{ marginRight: '1rem', color: '#ff4a00', textDecoration: 'none' }}>My Posts</Link>
      <Link to="/users" style={{ marginRight: '1rem', color: '#ff4a00', textDecoration: 'none' }}>Users</Link>
      {isLoggedIn ? (
        <>
          <Link to="/profile" style={{ marginRight: '1rem', color: '#ff4a00', textDecoration: 'none' }}>Profile</Link>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ff4a00',
              cursor: 'pointer',
              fontFamily: "'Creepster', cursive",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/" style={{ marginRight: '1rem', color: '#ff4a00', textDecoration: 'none' }}>Login</Link>
          <Link to="/signup" style={{ color: '#ff4a00', textDecoration: 'none' }}>Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
