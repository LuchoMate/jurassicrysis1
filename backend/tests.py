from django.test import TestCase, Client
from backend.models import Player, Card, Collection, Trade
from django.utils import timezone
from django.db import models
from django.conf import settings
from django.contrib import auth
import json

class ModelsTestCase(TestCase):
    def setUp(self):
        player1 = Player.objects.create(username='player1', id=1)
        player1.set_password('password1')
        player1.save()
        player2 = Player.objects.create(username='player2', id=2)
        player2.set_password('password2')
        player2.save()
        player3 = Player.objects.create(username='player3', id=3)
        player3.set_password('password3')
        player3.save()
        card1 = Card.objects.create(name='card1', id=1)
        card1.save()
        card2 = Card.objects.create(name='card2',id=2)
        card2.save()
        card3 = Card.objects.create(name='card3',id=3)
        card3.save()
        card4 = Card.objects.create(name='card4',id=4)
        card4.save()
        coll1 = Collection.objects.create(Owner=player1, Card_collected=card1, quantity=5, on_deck=2, id=1)
        coll1.save()
        coll2 = Collection.objects.create(Owner=player1, Card_collected=card2, quantity=3, on_deck=2, id=2)
        coll2.save()
        coll3 = Collection.objects.create(Owner=player2, Card_collected=card1, quantity=3, on_deck=1, id=3)
        coll3.save()
        coll4 = Collection.objects.create(Owner=player2, Card_collected=card3, quantity=2, on_deck=1, id=4)
        coll4.save()
        trade1 = Trade.objects.create(Sender=player1, Recipient=player2, Sender_card=card1, Recipient_card=card3, id=1)
        trade1.save()


    def test_getInvalidCardId(self):
        '''try getting an invalid card id'''

        login = self.client.login(username='player1', password='password1')
        response = self.client.get('/api/get_card/50')
        self.assertEqual(response.status_code, 404)

    def test_getInvalidCardName(self):
        '''try getting a card by an invalid name'''
        login = self.client.login(username='player1', password='password1')
        response = self.client.get('/api/return_card_id/invalidCard')
        self.assertEqual(response.status_code, 404)

    def test_countPlayerCards(self):
        '''counts # of players collection entries'''
        player = Player.objects.get(username='player2')
        self.assertEqual(player.player_cards.count(), 2)

    def test_cardAvailableTrade(self):
        '''check if a given card is available for trade'''
        login = self.client.login(username='player1', password='password1')
        response = self.client.get('/api/check_card/1')
        self.assertEqual(response.status_code, 200)

    def test_addInvalidCardDeck(self):
        '''attempts to add an invalid card to user's deck'''
        login = self.client.login(username='player2', password='password2')
        data={"content": 2}
        response = self.client.put('/api/update_deck', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 406)

    def test_removeInvalidCardDeck(self):
        '''attempts to remove an invalid card from user's deck'''
        login = self.client.login(username='player1', password='password1')
        data={"content": 3}
        response = self.client.delete('/api/update_deck', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 406)

    def test_playerWinsInvalid(self):
        '''attempts to put an invalid content on put request'''
        login = self.client.login(username='player1', password='password1')
        data={"body": "player wins"}
        response = self.client.put('/api/player_wins/invalid', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_buyInvalidPack(self):
        '''attempts to buy an invalid booster pack'''
        login = self.client.login(username='player2', password='password2')
        data={"content": "invalid"}
        response = self.client.put('/api/buy_pack', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 204)

    def test_offerInvalidCard(self):
        '''offers an invalid card to trade'''
        login = self.client.login(username='player1', password='password1')
        data={"TargetPlayer": "player2", "TargetCard": 1, "OfferedCard": 4}
        response = self.client.post('/api/new_trade', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_askInvalidCard(self):
        '''asks another user for a card he/she does not have'''
        login = self.client.login(username='player2', password='password2')
        data={"TargetPlayer": "player1", "TargetCard": 4, "OfferedCard": 1}
        response = self.client.post('/api/new_trade', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_deleteInvalidTrade(self):
        '''attempts to cancel a trade that doesn't involve this player'''
        login = self.client.login(username='player3', password='password3')
        data={"tradeId": 1}
        response = self.client.delete('/api/cancel_trade', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_acceptInvalidTrade(self):
        '''attempts to accept a trade for a card that recipient doesn't have'''
        login = self.client.login(username='player2', password='password2')
        data={"tradeId": 1, "senderPlayer": "player1", "senderCard": "card1", "recipientCard": "card4"}
        response = self.client.post('/api/accept_trade', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
