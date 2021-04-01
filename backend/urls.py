from django.urls import path
from . import views

urlpatterns = [
    path('mycollection', views.api_player_collection, name='mycollection' ),
    path('mydeck', views.api_player_deck, name='mydeck' ),
]