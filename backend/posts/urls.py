from django.urls import path
from . import views

urlpatterns = [
    path('post/<int:post_id>/like/', views.like_post, name='like_post'),
    path('post/<int:post_id>/dislike/', views.dislike_post, name='dislike_post'),
    path('post/<int:post_id>/interaction-status/', views.post_interaction_status, name='post_interaction_status'),
    path('posts/', views.create_post, name='create_post'),
    path('posts/get/', views.get_all_posts, name='get_all_posts'),
    path('posts/user/', views.get_user_posts, name='get_user_posts'),
    path('posts/<int:post_id>/update/', views.update_post, name='update_post'),
    path('posts/<int:post_id>/delete/', views.delete_post, name='delete_post'),
    path('user/<int:user_id>/profile/', views.user_profile, name='user-profile'),
    path('user/<int:user_id>/follow/', views.follow_unfollow, name='follow-unfollow'),
    path('user/<int:user_id>/posts/', views.user_posts, name='user_posts'),
    path('post/<int:post_id>/comments/', views.get_comments, name='get_comments'),
    path('post/<int:post_id>/add-comment/', views.add_comment, name='add_comment'),
]
