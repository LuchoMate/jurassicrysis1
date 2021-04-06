from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Player, Card, Collection
from .serializers import coll_serializer
from rest_framework.response import Response
import random

#get logged user card's collection
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_player_collection(request):
    player = Player.objects.get(username=request.user)
    query = player.player_cards.all()
    serializer = coll_serializer(query, many=True)
    
    return Response(serializer.data)

#get logged user's deck
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_player_deck(request):
    player = Player.objects.get(username=request.user)
    query = player.player_cards.all()
    deck = query.filter(on_deck__gte=1)
    serializer = coll_serializer(deck, many=True)

    return Response(serializer.data)


#get logged user's shuffled deck
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_shuffled_deck(request):
    
    player = Player.objects.get(username=request.user)
    query = player.player_cards.all()
    prev_deck = query.filter(on_deck__gte=1)

    deck = []
    for card in prev_deck:
        deck.append(card.Card_collected.id)
        if card.on_deck > 1 :
            deck.append(card.Card_collected.id)
    random.shuffle(deck)
    shuffled = {"shuffled": deck}
    return Response(shuffled)
        











