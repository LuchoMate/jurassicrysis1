from django.urls import path
from . import views

urlpatterns = [
    path('my_collection', views.api_player_collection, name='my_collection'),
    path('my_deck', views.api_player_deck, name='my_deck'),
    path('shuffled_deck', views.api_shuffled_deck, name='shuffled_deck'),
    path('opp_deck/<str:difficulty>', views.api_opp_deck, name='opp_deck'),
    path('get_card/<int:cardId>', views.api_get_card, name='get_card'),
]