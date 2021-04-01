from django.urls import path
from . import views

urlpatterns = [
    path('home', views.index, name='index'),
    path('play', views.play, name='play'),
    path('register', views.register, name='register'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("shop", views.shop, name="shop"),



]