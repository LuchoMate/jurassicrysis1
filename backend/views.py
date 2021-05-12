from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Player, Card, Collection
from .serializers import coll_serializer, card_serializer
from rest_framework.response import Response
from rest_framework import status
import random

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def api_get_card(request, cardId):
    try:
        thiscard = Card.objects.get(id=cardId)
    except Card.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = card_serializer(thiscard, many=False)
    return Response(serializer.data)

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

#get opponents shuffled deck
@api_view(['GET'])
def api_opp_deck(request, difficulty):

    if difficulty == "easy":
        deck = [3,3,5,5,6,6,18,18,19,19,34,34,35,35,51,51,52,52,53,53]
        random.shuffle(deck)
        shuffled = {"shuffled": deck}
    elif difficulty == "medium":
        deck = [6,6,12,12,14,24,24,27,27,39,39,46,54,54,59,59,73,73,72,69]
        random.shuffle(deck)
        shuffled = {"shuffled": deck}
    elif difficulty == "hard":
        deck = [13,13,16,17,30,31,32,46,47,47,59,61,61,62,74,76,77,80,80,82]
        random.shuffle(deck)
        shuffled = {"shuffled": deck}
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

    
    return Response(shuffled)

    
        











