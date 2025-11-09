Cravings — Full-Stack Social Media App for Food Lovers
A complete social media web app built with React (Vite) frontend and Django REST Framework backend. Users can share food cravings, post photos, interact via likes/comments, and connect with other food enthusiasts.​

Demo Video
Watch the demo here:
[
GitHub README files use Markdown, which does not support direct video embedding or playback. The reliable method is to upload videos to external hosts like Google Drive or YouTube and link them via a clickable thumbnail or badge. Direct loading of videos (e.g., via <video> tags or iframes) is blocked in GitHub's sandboxed viewer for security reasons.​

Table of Contents
Overview

Quick Start

Project Structure

Backend Setup (Django)

Frontend Setup (React + Vite)

API Endpoints

Features

Security

Screenshots

Developer

License

Overview
Cravings is a modern full-stack app that allows users to post pictures of dishes and food cravings, like and comment on content, follow other foodies, manage profiles with avatars, and view personalized feeds. It uses JWT for secure authentication and MySQL for data storage. The app solves the need for a niche social platform focused on food sharing while demonstrating full-stack development with React and Django.​​

Quick Start
Clone the Repository
text
git clone https://github.com/rezwanali2003/cravings.git
cd cravings
Backend Setup
text
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows; use source venv/bin/activate on Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend Setup
text
cd ../frontend
npm install
npm run dev
The frontend runs at http://localhost:5173, and the backend API at http://127.0.0.1:8000. Test by registering a user, logging in, and creating posts.​

Project Structure
text
Cravings/
├── backend/
│   ├── manage.py
│   ├── backend/               # Django core settings & URLs
│   ├── users/                 # Handles user auth & profiles
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── posts/                 # Post creation, likes, comments
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── requirements.txt
│   └── media/                 # Uploaded images
└── frontend/
    ├── src/
    │   ├── components/        # UI Components
    │   ├── api/               # API utility methods
    │   ├── styles/            # CSS/Tailwind styling
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
This structure separates concerns: backend for API and data logic, frontend for UI and client-side interactions. It follows best practices for full-stack Django-React apps by keeping static files (like React builds) in /static/ for production serving.​

Backend Setup (Django)
Database Setup (MySQL)
Install MySQL if needed (e.g., via apt on Ubuntu, brew on macOS, or official installer on Windows). Then create the database:

text
mysql -u root -p
CREATE DATABASE cravings_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON cravings_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
Update settings.py with:

text
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'cravings_db',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
Install dependencies from requirements.txt:

text
Django==5.1.4
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
mysqlclient==2.2.4
django-cors-headers==4.3.1
Pillow==10.1.0
Run migrations and create a superuser:

text
python manage.py makemigrations users posts
python manage.py migrate
python manage.py createsuperuser
Start the server: python manage.py runserver 0.0.0.0:8000. Access admin at http://127.0.0.1:8000/admin/.​

Frontend Setup (React + Vite)
Install dependencies:

text
cd frontend
npm install react-router-dom axios framer-motion
npm run dev
Add environment variable in .env:

text
VITE_API_URL=http://127.0.0.1:8000
Example API utility in src/api.js:

text
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  'Content-Type': 'application/json',
});

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE}/api/user/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

export const fetchPosts = async () => {
  const response = await fetch(`${API_BASE}/api/posts/get/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
};
This sets up API calls with JWT auth. For production, build with npm run build and serve from Django's static files.​​

API Endpoints
Method	Endpoint	Description
POST	/api/user/signup/	Register new user
POST	/api/user/login/	Login user
POST	/api/user/logout/	Logout user
GET	/api/posts/get/	Get all posts
POST	/api/posts/	Create post
PUT	/api/posts/<id>/update/	Update post
DELETE	/api/posts/<id>/delete/	Delete post
GET	/api/post/<id>/comments/	Get post comments
POST	/api/post/<id>/add-comment/	Add comment to post
POST	/api/post/<id>/like/	Like post
POST	/api/post/<id>/dislike/	Dislike post
GET	/api/user/get/	Get all users
POST	/api/user/<id>/follow/	Follow/unfollow user
These endpoints use REST principles with JWT authentication for protected routes. Test with tools like curl or Postman.​

Features
JWT Authentication: Secure login/signup with token-based access.

Post Management: Create, update, delete posts with image uploads.

Interactions: Like/dislike posts and add threaded comments.

User Profiles: Update bio, avatar, and manage followers.

Responsive UI: Mobile and desktop support using Tailwind CSS.

Real-time Updates: Instant reactions via API polling.

Search & Filter: Find posts and users easily.

The app emphasizes modularity, with Django handling business logic and React managing state via Redux or Context API for optimal performance.​​

Security
For development:

Set DEBUG = True in settings.py.

Use CORS_ALLOW_ALL_ORIGINS = True.

For production:

Set DEBUG = False.

Add ALLOWED_HOSTS = ['yourdomain.com'].

Configure CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "https://yourdomain.com"].

Use a .env file for secrets: SECRET_KEY=your_secret_key, DB_PASSWORD=root.

Enable HTTPS and validate JWT tokens properly.

Avoid exposing sensitive data in commits; use .gitignore for .env files.​

Screenshots
Add placeholders for visuals (upload to /assets/ folder):

Login Page: [Insert login screenshot here]

Feed: [Insert feed screenshot here]

Create Post: [Insert post creation screenshot here]

These help showcase the UI without needing embeds.​

Developer
Shaik Rezwan Ali
AI Researcher & Full-Stack Developer
Email: rezwanalishaik@gmail.com
LinkedIn: https://linkedin.com/in/shaik-rezwan-ali
GitHub: https://github.com/rezwanali2003
