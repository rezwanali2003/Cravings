import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/Home.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]); // State to store user posts
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  // Function to fetch the profile data
  const fetchProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/${userId}/profile/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsFollowing(data.is_following);
      } else {
        console.error("Error fetching profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  // Function to fetch the user's posts
  const fetchPosts = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/${userId}/posts/`, // API endpoint for posts
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts); // Assuming the response has a "posts" field
      } else {
        console.error("Error fetching posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Fetch profile and posts when component mounts or userId changes
  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [userId]);

  // Handle follow/unfollow action
  const handleFollowToggle = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/${userId}/follow/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setIsFollowing((prev) => !prev);
        alert(data.message);
        fetchProfile(); // Refresh profile to update follower count
      } else {
        console.error("Error following/unfollowing user");
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };
  
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="text-center mb-4">
          <button className="btn btn-secondary" onClick={() => navigate('/posts')}>
            Go to Posts
          </button>
        </div>
        <div className="text-center mb-4">
          <button className="btn btn-secondary" onClick={() => navigate('/users')}>
            Go to Users
          </button>
        </div>
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body text-center">
              <h3 className="card-title">{profile.username}</h3>
              <p className="card-text text-muted">{profile.email}</p>
              <hr />
              <div className="d-flex justify-content-around mb-4">
                <div>
                  <strong>Followers</strong>
                  <p>{profile.followers_count}</p>
                </div>
                <div>
                  <strong>Following</strong>
                  <p>{profile.following_count}</p>
                </div>
              </div>
              {profile.username !== localStorage.getItem("username") && (
                <button
                  className={`btn ${isFollowing ? "btn-success" : "btn-outline-primary"}`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Display User Posts */}
        <div className="col-md-8 mt-4 mb-4">
          <h4>User Posts</h4>
          <div className="list-group">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div className="list-group-item" key={post.id}>
                  <h5>{post.title}</h5>
                  <p>{post.content}</p>
                  <p className="text-muted">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
