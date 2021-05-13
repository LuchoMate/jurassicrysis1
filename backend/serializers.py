from rest_framework import serializers
from .models import Collection, Player, Card

class coll_serializer(serializers.ModelSerializer):

    class Meta:
        model= Collection
        fields = ('Card_collected', 'quantity', 'on_deck')

class card_serializer(serializers.ModelSerializer):

    class Meta:
        model= Card
        fields = '__all__'
