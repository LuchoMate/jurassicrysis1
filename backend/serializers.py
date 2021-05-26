from rest_framework import serializers
from .models import Collection, Player, Card, Trade

class coll_serializer(serializers.ModelSerializer):

    class Meta:
        model= Collection
        fields = ('Card_collected', 'quantity', 'on_deck')

class card_serializer(serializers.ModelSerializer):

    class Meta:
        model= Card
        fields = '__all__'

class trade_serializer(serializers.ModelSerializer):
    Sender = serializers.SlugRelatedField(
        slug_field='username',
        queryset=Player.objects.all()   
    )
    Recipient = serializers.SlugRelatedField(
        slug_field='username',
        queryset=Player.objects.all()   
    )

    class Meta:
        model = Trade
        fields = ('id', 'Sender', 'Recipient', 'Sender_card', 'Recipient_card')
