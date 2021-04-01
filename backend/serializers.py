from rest_framework import serializers
from .models import Collection, Player, Card

class coll_serializer(serializers.ModelSerializer):

    class Meta:
        model= Collection
        fields = ('Card_collected', 'quantity', 'on_deck')