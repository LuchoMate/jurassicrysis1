from django.urls import path
from . import views

urlpatterns = [
    path('home', views.index, name='index'),
    path('play', views.play, name='play'),
    path('register', views.register, name='register'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("shop", views.shop, name="shop"),
    path("mycollection", views.mycollection, name="mycollection"),
    path("deckmanager", views.deckmanager, name="deckmanager"),
    path("trader", views.trader, name="trader"),
    path("leaderboards", views.leaderboards, name="leaderboards"),
    path("database", views.database, name="database"),
    path("devbox", views.devbox, name="devbox"),
    path("test", views.test, name="test"),
]