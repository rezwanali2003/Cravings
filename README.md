# 🍴 Cravings — Full-Stack Social Media App for Food Lovers

A complete social media web app built with **React (Vite)** frontend and **Django REST Framework** backend.  
Users can share food cravings, post photos, interact via likes/comments, and connect with other food enthusiasts.

---

## 🎥 Demo Video

🔗 **Watch the demo here:**  
[Click to Watch on Google Drive or YouTube](#)

> GitHub README files use Markdown, which doesn't support direct video embedding or playback.  
> Upload your video externally (e.g., YouTube or Google Drive) and link it above.

---

## 📚 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Backend Setup (Django)](#backend-setup-django)
- [Frontend Setup (React--vite)](#frontend-setup-react--vite)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Security](#security)
- [Screenshots](#screenshots)
- [Developer](#developer)

---

## 🧠 Overview

Cravings is a **modern full-stack application** that allows users to:
- Post pictures of dishes and food cravings 🍕
- Like and comment on posts ❤️💬
- Follow other food lovers 👥
- Manage profiles with avatars 👤
- View personalized feeds 🍽️

Built with **React + Vite** for a fast frontend and **Django REST Framework (DRF)** for robust backend APIs.  
The project demonstrates **secure JWT authentication**, **modular architecture**, and **real-time interactivity**.

---

## ⚡ Quick Start

### 🧩 Clone the Repository

```
git clone https://github.com/rezwanali2003/cravings.git
cd cravings
```

### 🛠 Backend Setup

```
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
# source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 💻 Frontend Setup

```
cd ../frontend
npm install
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173/
- Backend API: http://127.0.0.1:8000/

You can now register a new user, log in, and start posting!

---

## 🧱 Project Structure

```
Cravings/
├── backend/
│   ├── manage.py
│   ├── backend/               # Django core settings & URLs
│   ├── users/                 # Handles user auth & profiles
│   ├── posts/                 # Post creation, likes, comments
│   ├── requirements.txt
│   └── media/                 # Uploaded images
└── frontend/
    ├── src/
    │   ├── components/        # UI Components
    │   ├── api/               # API utility methods
    │   ├── styles/            # Tailwind styling
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🗄️ Backend Setup (Django)

### 🧩 Database Setup (MySQL)

```
CREATE DATABASE cravings_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON cravings_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

Update `settings.py`:

```
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
```

### ⚙️ Run Migrations

```
python manage.py makemigrations users posts
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## 🎨 Frontend Setup (React + Vite)

### Install dependencies:

```
cd frontend
npm install react-router-dom axios framer-motion
npm run dev
```

### Add environment variable in `.env`:

```
VITE_API_URL=http://127.0.0.1:8000
```

### Example `src/api.js`:

```
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
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/signup/` | Register new user |
| POST | `/api/user/login/` | Login user |
| POST | `/api/user/logout/` | Logout user |
| GET | `/api/posts/get/` | Get all posts |
| POST | `/api/posts/` | Create post |
| PUT | `/api/posts/<id>/update/` | Update post |
| DELETE | `/api/posts/<id>/delete/` | Delete post |
| GET | `/api/post/<id>/comments/` | Get post comments |
| POST | `/api/post/<id>/add-comment/` | Add comment |
| POST | `/api/post/<id>/like/` | Like post |
| POST | `/api/post/<id>/dislike/` | Dislike post |
| GET | `/api/user/get/` | Get all users |
| POST | `/api/user/<id>/follow/` | Follow/Unfollow user |

---

## 🌟 Features

- 🔐 **JWT Authentication** — secure login/signup
- 🖼 **Post Management** — create, update, delete, and upload images
- 💬 **Interactions** — like, comment, and follow users
- 👤 **User Profiles** — update avatar, bio, and followers
- 📱 **Responsive UI** — Tailwind CSS for all screens
- ⚡ **Real-Time Updates** — instant feedback on interactions
- 🔍 **Search & Filter** — easily find users and posts

---

## 🛡️ Security

### Development

```
DEBUG = True
CORS_ALLOW_ALL_ORIGINS = True
```

### Production

```
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
CORS_ALLOWED_ORIGINS = ["https://yourdomain.com"]
```

Use a `.env` file for secrets:

```
SECRET_KEY=your_secret_key
DB_PASSWORD=root
```

---

## 🖼️ Screenshots

**Login Page:**  
![Login Page](assets/login-screenshot.png)

**Feed:**  
![Feed](assets/feed-screenshot.png)

**Create Post:**  
![Create Post](assets/create-post-screenshot.png)

*(Place images in `/assets/` and reference them in Markdown.)*

---

## 👨‍💻 Developer

**Shaik Rezwan Ali**  
AI Researcher & Full-Stack Developer

📧 [rezwanalishaik@gmail.com](mailto:rezwanalishaik@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/shaik-rezwan-ali-5b6a31235/)  
💻 [GitHub](https://github.com/rezwanali2003)

---

<div align="center">

[![Made with Django](https://img.shields.io/badge/Made%20with-Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Backend REST API](https://img.shields.io/badge/Backend-REST_API-0C4B33?style=for-the-badge&logo=python&logoColor=white)](https://www.djangoproject.com/)
[![Frontend Vite](https://img.shields.io/badge/Frontend-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>
