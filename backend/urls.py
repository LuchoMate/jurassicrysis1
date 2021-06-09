from django.urls import path
from . import views

urlpatterns = [
    path('my_collection', views.api_player_collection, name='my_collection'),
    path('my_deck', views.api_player_deck, name='my_deck'),
    path('shuffled_deck', views.api_shuffled_deck, name='shuffled_deck'),
    path('update_deck', views.api_update_deck, name='update_deck'),
    path('deck_composition', views.api_deck_composition, name='deck_composition'),
    path('collection_total', views.api_collection_total, name='collection_total'),
    path('leaderboard', views.api_leaderboard, name='leaderboard'),
    path('opp_deck/<str:difficulty>', views.api_opp_deck, name='opp_deck'),
    path('get_card/<int:cardId>', views.api_get_card, name='get_card'),
    path('return_card_id/<str:cardName>', views.api_return_card_id, name='return_card_id'),
    path('player_wins/<str:difficulty>', views.api_player_wins, name='player_wins'),
    path('player_loses', views.api_player_loses, name='player_loses'),
    path('buy_pack', views.api_buy_pack, name='buy_pack'),
    path('incoming_requests', views.api_incoming_requests, name='incoming_requests'),
    path('outgoing_requests', views.api_outgoing_requests, name='outgoing_requests'),
    path('check_card/<int:cardId>', views.api_check_available, name='check_card'),
    path('mycardstrade', views.api_my_avl_cards, name='mycardstrade'),
    path('myallavl', views.api_all_avl_cards, name='all_available'),
    path('new_trade', views.api_new_trade, name='new_trade'),
    path('cancel_trade', views.api_cancel_trade, name='cancel_trade'),
    path('accept_trade', views.api_accept_trade, name='accept_trade'),


]