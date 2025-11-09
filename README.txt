# Cravings Social Media App - Setup Guide

> A full-stack social media platform built with Django REST Framework backend and React frontend. Share cravings, posts, follow users, and build your food community!

***

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+ and npm
- Git
- MySQL Server (or PostgreSQL)

***

## 📁 Project Structure

```
Cravings/
├── backend/                 # Django REST API
│   ├── manage.py
│   ├── backend/             # Main Django project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/               # Users app (auth, profiles)
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── posts/               # Posts app (posts, comments)
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── requirements.txt
│   └── media/               # Uploaded images
└── frontend/                # React app (Vite)
    ├── src/
    │   ├── components/     # React components
    │   ├── api/            # API utility functions
    │   ├── styles/         # CSS files
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

***

## 🐍 Backend Setup (Django REST API)

### 1. Database Setup (MySQL)

Install and start MySQL server:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
Download from [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

Create database and user:
```sql
mysql -u root -p
CREATE DATABASE post_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON post_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Backend Environment

```bash
# Clone or navigate to your project
cd Cravings/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux/Mac: source venv/bin/activate
# Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Backend Requirements

Save this as `backend/requirements.txt`:

```txt
Django==5.1.4
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
mysqlclient==2.2.4
django-cors-headers==4.3.1
Pillow==10.1.0
```

Install:
```bash
pip install -r requirements.txt
```

### 4. Backend Configuration

Your `backend/backend/settings.py` should include:

```python
# Database (MySQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'post_db',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'users',
    'posts',
]

# Middleware (CORS must be near top)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS (Development)
CORS_ALLOW_ALL_ORIGINS = True

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

### 5. Database Migrations

```bash
# Make migrations for your apps
python manage.py makemigrations users
python manage.py makemigrations posts

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 6. Run Django Backend

```bash
python manage.py runserver 0.0.0.0:8000
```

***

## ⚛️ Frontend Setup (React + Vite)

### 1. Install Dependencies

```bash
cd frontend

# Install React Router and other dependencies
npm install react-router-dom
npm install framer-motion  # For animations (if used)
npm install

# For development
npm install

# For production build
npm run dev
```

### 2. Frontend Requirements

Your `frontend/package.json` should include:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.8.0",
    "framer-motion": "^10.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 3. Environment Variables

Create `frontend/.env` for API base URL:

```bash
REACT_APP_API_BASE=http://127.0.0.1:8000
```

### 4. API Configuration (frontend/src/api.js)

```javascript
const API_BASE = 'http://127.0.0.1:8000';

export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

// Auth
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  return response.json();
};

export const signUpUser = async (username, email, password) => {
  const response = await fetch(`${API_BASE}/user/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }
  return response.json();
};

// Posts
export const fetchPosts = async () => {
  const response = await fetch(`${API_BASE}/posts/get`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
};

export const createPost = async (formData) => {
  const response = await fetch(`${API_BASE}/posts/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create post');
  }
  return response.json();
};
```

***

## 🎯 Testing Your Setup

### Backend Test (Django)
```bash
# Start Django server
python manage.py runserver

# Test endpoints
curl http://127.0.0.1:8000/admin/          # Django admin
curl http://127.0.0.1:8000/api/user/get    # Get users
curl http://127.0.0.1:8000/api/posts/get   # Get posts
```

### Frontend Test (React)
```bash
# In a separate terminal
cd frontend
npm run dev
```

Visit `http://localhost:3000` and test:
- User registration → login
- Create posts with images
- Like/dislike posts
- View comments
- Follow/unfollow users
- Profile updates

***

## 🛠️ Development Commands

### Backend
```bash
# Start development server
python manage.py runserver

# Run with auto-reload
python manage.py runserver 0.0.0.0:8000

# Access Django admin
http://127.0.0.1:8000/admin/
```

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

***

## 📱 API Endpoints Reference

### Authentication
- `POST /api/user/signup` - Register new user
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout

### Posts
- `GET /api/posts/get/` - Get all posts
- `GET /api/posts/user/` - Get current user's posts
- `POST /api/posts/` - Create new post
- `PUT /api/posts/<id>/update/` - Update post
- `DELETE /api/posts/<id>/delete/` - Delete post

### Interactions
- `POST /api/post/<id>/like/` - Like post
- `POST /api/post/<id>/dislike/` - Dislike post
- `GET /api/post/<id>/interaction-status/` - Check like/dislike status

### Comments
- `GET /api/post/<id>/comments/` - Get post comments
- `POST /api/post/<id>/add-comment/` - Add comment to post

### Users
- `GET /api/user/get` - Get all users
- `GET /api/user/<id>/profile/` - Get user profile
- `POST /api/user/<id>/follow/` - Follow/unfollow user

### Profile
- `GET /api/user/profile/data` - Get current user profile
- `POST /api/user/profile/update` - Update current user profile

***

## 🔒 Security Notes

### Development
- `CORS_ALLOW_ALL_ORIGINS = True` (only for development)
- `DEBUG = True` (disable in production)

### Production
Update `settings.py`:
```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Dev React
    "https://yourdomain.com",  # Production React
]
```

### Environment Variables
Create `.env` in backend root:
```
SECRET_KEY=your-secret-key-here
DB_PASSWORD=your-mysql-password
```

***

## 📚 Project Features

✅ **User Authentication** - JWT tokens, secure login/signup  
✅ **Post Management** - Create, read, update, delete posts  
✅ **Image Uploads** - Profile pictures and post photos  
✅ **Like/Dislike System** - Vote on posts with counts  
✅ **Comments** - Threaded comments with replies  
✅ **Follow/Unfollow** - Social connections between users  
✅ **Profile Management** - Update user info, bio, avatar  
✅ **Responsive Design** - Works on desktop, tablet, mobile  
✅ **Real-time Updates** - Instant like/dislike reactions  
✅ **Search & Filter** - Find posts and users easily  

***

## 🎬 Demo Video

> [Add demo video URL here when available]

***

## 📞 Support

- Found a bug? [Open an issue](https://github.com/yourusername/cravings/issues)
- Want to contribute? [See CONTRIBUTING.md](CONTRIBUTING.md)
- Questions? Check [discussion forum](https://github.com/yourusername/cravings/discussions)

***

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

***

## 🌟 Acknowledgments

- Built with ❤️ for food lovers everywhere
- Special thanks to Django, React, and open source communities

***

**Made with** 🍴 **by Shaik Rezwan Ali**  
**Connect:** [LinkedIn](https://linkedin.com/in/shaik-rezwan-ali) 

***

*Note: Before deploying to production, remember to generate a new SECRET_KEY, configure proper CORS settings, and secure your database credentials.*

***

This README provides a comprehensive guide for anyone to download, set up, and run your complete Cravings social media application with both Django backend and React frontend!