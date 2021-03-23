from django.urls import path
from . import views

urlpatterns = [
    path('home', views.index, name='index'),
    path('play', views.play, name='play'),
]