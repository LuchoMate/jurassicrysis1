from django.http.response import Http404
from rest_framework import response
from frontend.views import play
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Player, Card, Collection, Trade
from .serializers import coll_serializer, card_serializer, trade_serializer
from rest_framework.response import Response
from rest_framework import status
import json
from django.http import JsonResponse
import random
from random import randrange
from django.db import IntegrityError

#Gets card by id
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def api_get_card(request, cardId):
    try:
        thiscard = Card.objects.get(id=cardId)
    except Card.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = card_serializer(thiscard, many=False)
    return Response(serializer.data)

#Returns card id given its name
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def api_return_card_id(request, cardName):
    try:
        thiscard = Card.objects.get(name=cardName)
    except Card.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    cardid= {"cardid": thiscard.id}
    return Response(cardid, status=status.HTTP_200_OK)


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
    prev_deck = query.filter(on_deck__gte=1)

    deck = []
    for card in prev_deck:
        deck.append(card.Card_collected.id)
        if card.on_deck > 1 :
            deck.append(card.Card_collected.id)
    deck.sort()
    mydeck = {"deck": deck}
    return Response(mydeck)


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

#Adds or removes cards from player's deck
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_update_deck(request):
    player = Player.objects.get(username=request.user)
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:
            cardToAdd = Card.objects.get(id=data["content"])
        except Card.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            cardCollected = Collection.objects.filter(Owner = player).get(Card_collected = cardToAdd)
        except Collection.DoesNotExist:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        #Attempts to add to deck
        if cardCollected.quantity > cardCollected.on_deck:
            if cardCollected.on_deck < 2:
                on_deck = cardCollected.on_deck
                on_deck = on_deck +1
                cardCollected.on_deck = on_deck
                cardCollected.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                #Maximum 2 per deck
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    elif request.method == 'DELETE':
        data = json.loads(request.body)
        try:
            cardToRemove = Card.objects.get(id=data["content"])
        except Card.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            cardCollected = Collection.objects.filter(Owner = player).get(Card_collected = cardToRemove)
        except Collection.DoesNotExist:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        #Attemps to remove from deck
        if cardCollected.on_deck > 0:
            quantity = cardCollected.on_deck
            quantity = quantity - 1
            cardCollected.on_deck = quantity
            cardCollected.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
           return Response(status=status.HTTP_403_FORBIDDEN) 
 
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

#get player's deck composition (# of carnivorous, herbivorous, etc)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_deck_composition(request):
    player = Player.objects.get(username=request.user)
    query = player.player_cards.all()
    prev_deck = query.filter(on_deck__gte=1)

    ca=0
    he=0
    aq=0
    fl=0
    ev=0
    for card in prev_deck:
        
        if card.Card_collected.card_type == "ca":
            ca = ca +1
            if card.on_deck > 1 :
                ca = ca +1
        if card.Card_collected.card_type == "he":
            he = he +1
            if card.on_deck > 1:
                he= he+1
        if card.Card_collected.card_type == "aq":
            aq = aq + 1
            if card.on_deck > 1:
                aq = aq +1
        if card.Card_collected.card_type == "fl":
            fl = fl +1
            if card.on_deck > 1:
                fl = fl +1
        if card.Card_collected.card_type == "ev":
            ev = ev +1
            if card.on_deck > 1:
                ev = ev +1

    composition = {"ca": ca, "he": he, "aq": aq, "fl": fl, "ev": ev}
    return Response(composition, status=status.HTTP_200_OK)

#get player's # of collected cards as well as quantity of each one
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_collection_total(request):
    player = Player.objects.get(username=request.user)
    query = player.player_cards.all()
    cardid = []
    quantity = []
    for coll in query:
        cardid.append(coll.Card_collected.id)
        quantity.append(coll.quantity)

    Completion = {"Completion": len(query), "CardId": cardid, "Quantity": quantity}
    return Response(Completion, status=status.HTTP_200_OK)

#get all players stats for leaderboard
@api_view(['GET'])
def api_leaderboard(request):
    query = Player.objects.all().order_by('-victories')
    victories_qnt = []
    victories_ply = []
    for player in query:
        victories_ply.append(player.username)
        victories_qnt.append(player.victories)
    query2 = Player.objects.all().order_by('-xp')
    xp_ply = []
    xp_qnt = []
    for player in query2:
        xp_ply.append(player.username)
        xp_qnt.append(player.xp)

    allplayers = {}
    query3= Player.objects.all()
    for player in query3:
        playertocheck = player.username
        playerCollected = len(player.player_cards.all())
        allplayers[playertocheck] = playerCollected

    coll_sorted = {k: v for k, v in sorted(allplayers.items(), key=lambda x: x[1], reverse=True)}
    
    Statistics = {"victories_ply": victories_ply, "victories": victories_qnt, "xp_ply": xp_ply, "xp": xp_qnt, "PlayersCollection": coll_sorted}
    return Response(Statistics, status=status.HTTP_200_OK)

#get opponents shuffled deck
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_opp_deck(request, difficulty):

    if difficulty == "easy":
        deck = [3,3,5,5,6,6,18,18,19,19,34,34,35,35,51,51,52,52,53,53]
        random.shuffle(deck)
        shuffled = {"shuffled": deck}
    elif difficulty == "medium":
        deck = [6,8,8,12,14,24,24,27,27,39,39,46,54,54,59,66,66,72,69,78]
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

            player.dinocoins = player.dinocoins - 5000
            player.save()
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

            player.dinocoins = player.dinocoins - 5000
            player.save()
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

            player.dinocoins = player.dinocoins - 5000
            player.save()
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

            player.dinocoins = player.dinocoins - 5000
            player.save()
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

            player.dinocoins = player.dinocoins - 5000
            player.save()
            cardsAdded ={"cardsAdded": boosterpack}
            return Response(cardsAdded, status=status.HTTP_201_CREATED)

        else:
            invalidBooster={"response":"invalid booster pack"}
            return Response(invalidBooster, status=status.HTTP_204_NO_CONTENT)
  
    
    else:
        noCoins={"response": "not enough Dinocoins!"}
        return Response(noCoins, status=status.HTTP_204_NO_CONTENT)

#Get players incoming trades requests
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_incoming_requests(request):
    player = Player.objects.get(username=request.user)
    incoming = player.incoming_requests.all()
    if incoming:
        serializer = trade_serializer(incoming, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        body= {"Content": "No incoming requests at the moment."}
        return Response(body, status=status.HTTP_404_NOT_FOUND)

#Get players outgoing trades requests
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_outgoing_requests(request):
    player = Player.objects.get(username=request.user)
    outgoing = player.sent_requests.all()
    if outgoing:
        serializer = trade_serializer(outgoing, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        body= {"Content": "No outgoing requests at the moment."}
        return Response(body, status=status.HTTP_404_NOT_FOUND)

#Check if a given card is available for trade (quantity > on_deck of any user)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_check_available(request, cardId):
    try:
        card = Card.objects.get(id=cardId)
    except Card.DoesNotExist:
        body= {"Content": "Invalid card, please try again."}
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    query = Collection.objects.filter(Card_collected = card)
    available_query = []
    for collected in query:
        if collected.quantity > collected.on_deck:
            if collected.Owner != request.user:
                available_query.append(collected)

    if available_query:
        serializer = coll_serializer(available_query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        body= {"Content": "No users with this card available at the moment."}
        return Response(body, status=status.HTTP_404_NOT_FOUND)

#Returns a list of user's available cards for trade (one of each, not in deck)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_my_avl_cards(request):
    player = Player.objects.get(username=request.user)
    query = Collection.objects.filter(Owner=player)
    if query:
        availableCardsList = []
        for card in query:
            if card.quantity > card.on_deck:
                availableCardsList.append(card.Card_collected.id)
        if availableCardsList:
            availableCardsList.sort()
            return Response(availableCardsList, status=status.HTTP_200_OK)
        else:
            body= {"Content": "You don't have any cards available."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)
    else:
        body= {"Content": "You don't have any cards available."}
        return Response(body, status=status.HTTP_404_NOT_FOUND)

#Returns a list of all of the user's available cards
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_all_avl_cards(request):
    player = Player.objects.get(username=request.user)
    query = Collection.objects.filter(Owner=player)
    if query:
        available_cards = []
        for card in query:
            if card.quantity > card.on_deck:
                for i in range(card.quantity):
                    available_cards.append(card.Card_collected.id)

        if available_cards:
            available_cards.sort()
            return Response(available_cards, status=status.HTTP_200_OK)
        else:
            body= {"Content": "You don't have any cards available."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)
    else:
        body= {"Content": "You don't have any cards available."}
        return Response(body, status=status.HTTP_404_NOT_FOUND)


#Create a new trade request
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_new_trade(request):
    requestPlayer = Player.objects.get(username=request.user)
    if request.method == 'POST':
        postData = request.data

        try:
            targetPlayer = Player.objects.get(username=postData["TargetPlayer"])
        except Player.DoesNotExist:
            body= {"Content": "Requested player does not exist."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)

        try:
            targetCard = Card.objects.get(id=postData["TargetCard"])
        except Card.DoesNotExist:
            body= {"Content": "Requested card does not exist."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)
 
        try:   
            offeredCard = Card.objects.get(id=postData["OfferedCard"])
        except Card.DoesNotExist:
            body= {"Content": "Offered card does not exist."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)

        #double checks if cards are in players collections
        targetColl = targetPlayer.player_cards.all()
        try:
            checkTargetCard = targetColl.get(Card_collected = targetCard)
        except Collection.DoesNotExist:
            body= {"Content": f"{targetPlayer} does not own card {targetCard.name}."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)
         
        if checkTargetCard:
            if checkTargetCard.quantity <= checkTargetCard.on_deck:
                body= {"Content": f"{targetPlayer} does not have card {targetCard.name} available for trade."}
                return Response(body, status=status.HTTP_404_NOT_FOUND)  
        

        userColl = requestPlayer.player_cards.all()
        try:
            checkPlayerCard = userColl.get(Card_collected = offeredCard)
        except Collection.DoesNotExist:
            body= {"Content": f"You do not own {offeredCard.name}."}
            return Response(body, status=status.HTTP_404_NOT_FOUND) 

        if checkPlayerCard:
            if checkPlayerCard.quantity <= checkPlayerCard.on_deck:
                body= {"Content": f"You do not have {offeredCard.name} available for trade."}
                return Response(body, status=status.HTTP_404_NOT_FOUND)
        
        try:
            newTrade = Trade(Sender = requestPlayer, Recipient = targetPlayer,
            Sender_card = offeredCard, Recipient_card = targetCard)
            newTrade.save()
        except IntegrityError:
            body= {"Content": "Trade with the same parameters already active."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)

        serializer = trade_serializer(newTrade)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
         
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

#Deletes logged user given trade request
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def api_cancel_trade(request):
    requestPlayer = Player.objects.get(username=request.user)
    if request.method == 'DELETE':
        data = json.loads(request.body)
        try:
            tradeToCancel = Trade.objects.get(id=data["tradeId"])
        except Trade.DoesNotExist:
            body= {"Content": "This trade request does not exist."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)

        
        if tradeToCancel.Sender.username == requestPlayer.username or tradeToCancel.Recipient.username == requestPlayer.username:
            try:
                tradeToCancel.delete()
            except IntegrityError:
                body= {"Content": "Could not delete current trade, try again later."}
                return Response(body, status=status.HTTP_409_CONFLICT)
        
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            body= {"Content": "You cannot modify this trade."}
            return Response(body, status=status.HTTP_403_FORBIDDEN)

    else:
       return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED) 

#Accepts requested trade and deletes related card trades, if necessary
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_accept_trade(request):
    recipientPlayer = Player.objects.get(username=request.user)
    if request.method == 'POST':
        postData = request.data

        try:
            senderPlayer = Player.objects.get(username=postData["senderPlayer"])
        except Player.DoesNotExist:
            body= {"Content": "Requester player does not exist."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)

        try:
            senderCard = Card.objects.get(name=postData["senderCard"])
        except Card.DoesNotExist:
            body= {"Content": "Offered card does not exist."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)

        try:
            recipientCard = Card.objects.get(name=postData["recipientCard"])
        except Card.DoesNotExist:
            body= {"Content": "Offered card does not exist."}
            return Response(body, status=status.HTTP_404_NOT_FOUND)

        try:
            thisTrade = Trade.objects.get(id=postData["tradeId"])
        except Trade.DoesNotExist:
            body= {"Content": "This trade is no longer available"}
            return Response(body, status=status.HTTP_404_NOT_FOUND)

        #double checks if cards are in players collections
        targetColl = recipientPlayer.player_cards.all()
        try:
            checkTargetCard = targetColl.get(Card_collected = recipientCard)
        except Collection.DoesNotExist:
            body= {"Content": "You do not own this card"}
            return Response(body, status=status.HTTP_404_NOT_FOUND) 
        if checkTargetCard:
            if checkTargetCard.quantity <= checkTargetCard.on_deck:
                body= {"Content": "Your card is not available for trade."}
                return Response(body, status=status.HTTP_404_NOT_FOUND)  
        
            
        senderColl = senderPlayer.player_cards.all()
        try:
            checkPlayerCard = senderColl.get(Card_collected = senderCard)
        except Collection.DoesNotExist:
            body= {"Content": "Sender does not own his/her offered card"}
            return Response(body, status=status.HTTP_404_NOT_FOUND)
        if checkPlayerCard:
            if checkPlayerCard.quantity <= checkPlayerCard.on_deck:
                body= {"Content": "Sender does not have this card available for trade"}
                return Response(body, status=status.HTTP_404_NOT_FOUND)
        
        #Adds Sender card to Recipient's collection
        receivingCard = []
        try:
            receivingCard = targetColl.get(Card_collected = senderCard)

        except Collection.DoesNotExist:
            newCollection = Collection(Owner = recipientPlayer, 
            Card_collected = senderCard, quantity = 1, on_deck = 0)
            newCollection.save()

        if receivingCard:
            addquantity = receivingCard.quantity
            addquantity = addquantity + 1
            receivingCard.quantity = addquantity
            receivingCard.save()

        #Deletes sender card from his/her collection
        if checkPlayerCard.quantity > 1:
            substractQuantity = checkPlayerCard.quantity
            substractQuantity = substractQuantity -1
            checkPlayerCard.quantity = substractQuantity
            checkPlayerCard.save()
            if checkPlayerCard.quantity == checkPlayerCard.on_deck:
                #deleting related trades (since card is no longer available)
                try:
                    relatedOutgoingTrades = senderPlayer.sent_requests.filter(Sender_card = senderCard)
                except Trade.DoesNotExist:
                    pass
                for trade in relatedOutgoingTrades:
                    trade.delete()

                try:
                    relatedIncomingTrades = senderPlayer.incoming_requests.filter(Recipient_card = senderCard)
                except Trade.DoesNotExist:
                    pass
                for trade in relatedIncomingTrades:
                    trade.delete()

        else:
            checkPlayerCard.delete()
            try:
                relatedOutgoingTrades = senderPlayer.sent_requests.filter(Sender_card = senderCard)
            except Trade.DoesNotExist:
                pass
            for trade in relatedOutgoingTrades:
                trade.delete()

            try:
                relatedIncomingTrades = senderPlayer.incoming_requests.filter(Recipient_card = senderCard)
            except Trade.DoesNotExist:
                pass
            for trade in relatedIncomingTrades:
                trade.delete()
            
        
        #Adds Recipient card to Sender's collection
        sendingCard = []
        try:
            sendingCard = senderColl.get(Card_collected = recipientCard)
        except Collection.DoesNotExist :
            newCollection = Collection(Owner = senderPlayer,
            Card_collected = recipientCard, quantity = 1, on_deck = 0)
            newCollection.save()

        if sendingCard:
            addquantity = sendingCard.quantity
            addquantity = addquantity +1
            sendingCard.quantity = addquantity
            sendingCard.save()

        #Deletes recipient card from his/her collection
        if checkTargetCard.quantity > 1:
            substractQuantity = checkTargetCard.quantity
            substractQuantity = substractQuantity -1
            checkTargetCard.quantity = substractQuantity
            checkTargetCard.save()
            if checkTargetCard.quantity == checkTargetCard.on_deck:
                #deleting related trades (since card is no longer available)
                try:
                    relatedOutgoingTrades = recipientPlayer.sent_requests.filter(Sender_card = recipientCard)
                except Trade.DoesNotExist:
                    pass
                for trade in relatedOutgoingTrades:
                    trade.delete()

                try:
                    relatedIncomingTrades = recipientPlayer.incoming_requests.filter(Recipient_card = recipientCard)
                except Trade.DoesNotExist:
                    pass
                for trade in relatedIncomingTrades:
                    trade.delete()

        else:
            checkTargetCard.delete()
            try:
                relatedOutgoingTrades = recipientPlayer.sent_requests.filter(Sender_card = recipientCard)
            except Trade.DoesNotExist:
                pass
            for trade in relatedOutgoingTrades:
                trade.delete()

            try:
                relatedIncomingTrades = recipientPlayer.incoming_requests.filter(Recipient_card = recipientCard)
            except Trade.DoesNotExist:
                pass
            for trade in relatedIncomingTrades:
                trade.delete()

       
        try:
            thisTrade.delete()
        except IntegrityError:
            body= {"Content": "Could not delete current trade, try again later."}
            return Response(body, status=status.HTTP_409_CONFLICT)
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    else:
      return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)   









        











