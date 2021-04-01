from django.urls import path
from . import views

urlpatterns = [
    path('my_collection', views.api_player_collection, name='my_collection' ),
    path('my_deck', views.api_player_deck, name='my_deck' ),
]