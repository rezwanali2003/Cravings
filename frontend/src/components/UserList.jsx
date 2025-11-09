import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const currentUsername = localStorage.getItem('username');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/get', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          const filteredUsers = data.filter(user => user.username !== currentUsername);
          setUsers(filteredUsers);
          setLoading(false);
        } else {
          setError('Error fetching users');
          setLoading(false);
        }
      } catch {
        setError('Error fetching users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p className="loading-text">Loading users...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="userlist-page">
      <header className="userlist-header">
        <h1>Users</h1>
        <button className="btn-go-back" onClick={() => navigate('/home')}>Go Back</button>
      </header>

      <main className="userlist-main">
        <ul className="userlist">
          {users.map(user => (
            <li key={user.id} className="userlist-item">
              <span>{user.username}</span>
              <button className="btn-view-profile" onClick={() => navigate(`/user/${user.id}`)}>View Profile</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default UserList;
