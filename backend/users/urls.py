from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login_user, name='login'),
    path('signup', views.signup_user, name='signup'),
    path('logout',views.logout_user,name='logout'),

    path('get', views.get_all_users, name='get_all_users'),

    
    path('profile/update',views.update_profile,name='update_profile'),
    path('profile/data', views.get_profile, name='get_profile'),
]
