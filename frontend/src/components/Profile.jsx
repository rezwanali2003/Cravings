import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Profile = () => {
  const navigate = useNavigate();

  const user = localStorage.getItem('username');
  const mail = localStorage.getItem('email');
  const access = localStorage.getItem('accessToken');

  const [formData, setFormData] = useState({
    username: user,
    email: mail,
    phone: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const apiUrl = 'http://127.0.0.1:8000/api/user/profile/data';
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: user,
            email: mail,
            phone: data.phone || '',
            bio: data.bio || '',
          });
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, [user, mail, access]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const apiUrl = 'http://127.0.0.1:8000/api/user/profile/update';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch {
      setMessage('An error occurred while updating the profile.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="loading-text">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile Page</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" value={formData.username} disabled readOnly className="input-field disabled" />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" value={formData.email} disabled readOnly className="input-field disabled" />
        </div>
        <div className="input-group">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
        </div>
        <div className="input-group">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" rows="4" value={formData.bio} onChange={handleChange} className="input-field textarea" />
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      {message && <div className="profile-message">{message}</div>}
      <button className="btn-home" onClick={() => navigate('/home')}>Go to Home</button>
    </div>
  );
};

export default Profile;
