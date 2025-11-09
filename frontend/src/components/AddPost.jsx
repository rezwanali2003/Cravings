import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const apiUrl = 'http://127.0.0.1:8000/api/posts/';
    const accessToken = localStorage.getItem('accessToken');

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('content', formData.content);
      if (photo) {
        form.append('photo', photo);
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Post created successfully!');
        setTimeout(() => {
          navigate('/user-post');
        }, 1500); // Slightly longer delay for visual feedback
      } else {
        setMessage(data.detail || 'Error creating the post.');
      }
    } catch (error) {
      setMessage('Error creating the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-post-page">
      <div className="add-post-container">
        <h2 className="add-post-title">Crave a New Post</h2>
        <form onSubmit={handleSubmit} className="add-post-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title of Your Craving</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="What's burning inside?"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="form-label">Spill Your Hunger</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="input-field"
              rows="5"
              placeholder="Let the words devour the page..."
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="photo" className="form-label">Feed It a Visual (Optional)</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="input-field file-input"
            />
            {photoPreview && (
              <div className="photo-preview-container">
                <img src={photoPreview} alt="Preview of Your Feast" className="photo-preview" />
                <p className="preview-caption">A glimpse of the hunger...</p>
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="add-post-button" disabled={loading}>
              {loading ? (
                <span className="loading-text">Devouring Your Words...</span>
              ) : (
                'Unleash the Post'
              )}
            </button>
          </div>
        </form>
        {message && (
          <div className={`message-alert ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPost;