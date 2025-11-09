import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/Signup';
import Home from './components/Home';
import Profile from './components/Profile';
import PostsList from './components/PostsList';
import AddPost from './components/AddPost';
import UserPosts from './components/UserPost';
import UserProfile from './components/UserProfile';
import UserList from './components/UserList';
import Navbar from './components/Navbar';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); // detect current page
  const handleRedirect = (status) => setIsLoggedIn(status);

  // Hide navbar only on login and signup pages
  const hideNavbar = location.pathname === '/' || location.pathname === '/signup';

  return (
    <>
      {!hideNavbar && <Navbar isLoggedIn={isLoggedIn} handleLogout={() => setIsLoggedIn(false)} />}
      <Routes>
        <Route path="/" element={<Login onLogin={handleRedirect} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={isLoggedIn ? <Home onSignOut={handleRedirect} /> : <Navigate to="/" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
        <Route path="/users" element={isLoggedIn ? <UserList /> : <Navigate to="/" />} />
        <Route path="/posts" element={isLoggedIn ? <PostsList /> : <Navigate to="/" />} />
        <Route path="/add-post" element={isLoggedIn ? <AddPost /> : <Navigate to="/" />} />
        <Route path="/user-post" element={isLoggedIn ? <UserPosts /> : <Navigate to="/" />} />
        <Route path="/user/:userId" element={isLoggedIn ? <UserProfile /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
