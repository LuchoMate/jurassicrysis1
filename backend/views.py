from frontend.views import play
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Player, Card, Collection
from .serializers import coll_serializer, card_serializer
from rest_framework.response import Response
from rest_framework import status
import json
from django.http import JsonResponse
import random
from random import randrange

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

#Player wins spoils
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def api_player_wins(request, difficulty):
    if request.method == 'PUT':
        player = Player.objects.get(username=request.user)
        
        if difficulty == "easy":
            prizemoney = player.dinocoins
            prizemoney = prizemoney + 1000
            player.dinocoins = prizemoney
            prizexp = player.xp
            prizexp = prizexp + 100
            player.xp = prizexp
            totalwins = player.victories
            totalwins = totalwins + 1
            player.victories = totalwins
            player.save()
            return Response(status=status.HTTP_201_CREATED)

        elif difficulty == "medium":
            prizemoney = player.dinocoins
            prizemoney = prizemoney + 2000
            player.dinocoins = prizemoney
            prizexp = player.xp
            prizexp = prizexp + 300
            player.xp = prizexp
            totalwins = player.victories
            totalwins = totalwins + 1
            player.victories = totalwins
            player.save()
            return Response(status=status.HTTP_201_CREATED)

        elif difficulty == "hard":
            prizemoney = player.dinocoins
            prizemoney = prizemoney + 3500
            player.dinocoins = prizemoney
            prizexp = player.xp
            prizexp = prizexp + 600
            player.xp = prizexp
            totalwins = player.victories
            totalwins = totalwins + 1
            player.victories = totalwins
            player.save()
            return Response(status=status.HTTP_201_CREATED)

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def api_player_loses(request):

    if request.method == 'PUT':
        player = Player.objects.get(username=request.user)
        losscount = player.losses
        losscount = losscount + 1
        player.losses = losscount
        player.save()
        return Response(status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

#Chooses and add 3 random cards to players collection
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def api_buy_pack(request):

    player = Player.objects.get(username=request.user)
    if player.dinocoins >= 5000:
        data = json.loads(request.body)
        boosterpack = []
        if data["content"] == "ca":
            #restar dinocoins
            #luego de elegir, añadirlas a la coleccion
            for x in range(3):
                rNumber = random.random()
                if rNumber <= 0.8:#common card
                    boosterpack.append(randrange(3, 12))

                    
                elif rNumber > 0.8 and rNumber <= 0.95:#scarce card
                    boosterpack.append(randrange(12, 16))
                    
                else:
                    boosterpack.append(randrange(16,18))#exceptional card

            playerCollection = Collection.objects.filter(Owner = player)
            for card in boosterpack:
                cardCheck = Card.objects.get(id=card)
                if playerCollection.filter(Card_collected = cardCheck):#already in collection
                    cardModify = playerCollection.get(Card_collected = cardCheck)
                    cardModify.quantity = cardModify.quantity + 1
                    cardModify.save()
                else:#not in collection, create new entry
                    newCollection = Collection(Owner = player, Card_collected = cardCheck)
                    newCollection.save()

            cardsAdded ={"cardsAdded": boosterpack}
            return Response(cardsAdded, status=status.HTTP_201_CREATED)


        elif data["content"] == "he":
            for x in range(3):
                rNumber = random.random()
                if rNumber <= 0.8:
                 boosterpack.append(randrange(18, 27))   
                    
                elif rNumber > 0.8 and rNumber <= 0.95:
                    boosterpack.append(randrange(27, 31))
                    
                else:
                    boosterpack.append(randrange(31, 33))

            playerCollection = Collection.objects.filter(Owner = player)
            for card in boosterpack:
                cardCheck = Card.objects.get(id=card)
                if playerCollection.filter(Card_collected = cardCheck):#already in collection
                    cardModify = playerCollection.get(Card_collected = cardCheck)
                    cardModify.quantity = cardModify.quantity + 1
                    cardModify.save()
                else:#not in collection, create new entry
                    newCollection = Collection(Owner = player, Card_collected = cardCheck)
                    newCollection.save()

            cardsAdded ={"cardsAdded": boosterpack}
            return Response(cardsAdded, status=status.HTTP_201_CREATED)
   
        elif data["content"] == "aq":
            for x in range(3):
                rNumber = random.random()
                if rNumber <= 0.8:
                 boosterpack.append(randrange(33, 42))   
                    
                elif rNumber > 0.8 and rNumber <= 0.95:
                    boosterpack.append(randrange(42, 46))
                    
                else:
                    boosterpack.append(randrange(46, 48))

            playerCollection = Collection.objects.filter(Owner = player)
            for card in boosterpack:
                cardCheck = Card.objects.get(id=card)
                if playerCollection.filter(Card_collected = cardCheck):#already in collection
                    cardModify = playerCollection.get(Card_collected = cardCheck)
                    cardModify.quantity = cardModify.quantity + 1
                    cardModify.save()
                else:#not in collection, create new entry
                    newCollection = Collection(Owner = player, Card_collected = cardCheck)
                    newCollection.save()

            cardsAdded ={"cardsAdded": boosterpack}
            return Response(cardsAdded, status=status.HTTP_201_CREATED)

            
        elif data["content"] == "fl":
            for x in range(3):
                rNumber = random.random()
                if rNumber <= 0.8:
                 boosterpack.append(randrange(48, 57))   
                    
                elif rNumber > 0.8 and rNumber <= 0.95:
                    boosterpack.append(randrange(57, 61))
                    
                else:
                    boosterpack.append(randrange(61, 63))

            playerCollection = Collection.objects.filter(Owner = player)
            for card in boosterpack:
                cardCheck = Card.objects.get(id=card)
                if playerCollection.filter(Card_collected = cardCheck):#already in collection
                    cardModify = playerCollection.get(Card_collected = cardCheck)
                    cardModify.quantity = cardModify.quantity + 1
                    cardModify.save()
                else:#not in collection, create new entry
                    newCollection = Collection(Owner = player, Card_collected = cardCheck)
                    newCollection.save()

            cardsAdded ={"cardsAdded": boosterpack}
            return Response(cardsAdded, status=status.HTTP_201_CREATED)



        elif data["content"] == "ev":
            for x in range(3):
                rNumber = random.random()
                if rNumber <= 0.8:
                 boosterpack.append(randrange(63, 75))   
                    
                elif rNumber > 0.8 and rNumber <= 0.95:
                    boosterpack.append(randrange(75, 81))
                    
                else:
                    boosterpack.append(randrange(81, 83))

            playerCollection = Collection.objects.filter(Owner = player)
            for card in boosterpack:
                cardCheck = Card.objects.get(id=card)
                if playerCollection.filter(Card_collected = cardCheck):#already in collection
                    cardModify = playerCollection.get(Card_collected = cardCheck)
                    cardModify.quantity = cardModify.quantity + 1
                    cardModify.save()
                else:#not in collection, create new entry
                    newCollection = Collection(Owner = player, Card_collected = cardCheck)
                    newCollection.save()

            cardsAdded ={"cardsAdded": boosterpack}
            return Response(cardsAdded, status=status.HTTP_201_CREATED)

        else:
            invalidBooster={"response":"invalid booster pack"}
            return Response(invalidBooster, status=status.HTTP_204_NO_CONTENT)
  
    
    else:
        noCoins={"response": "no Money!"}
        return Response(noCoins, status=status.HTTP_204_NO_CONTENT)


        











