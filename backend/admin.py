from django.contrib import admin
from .models import Player, Card, Collection, Trade

admin.site.register(Player)
admin.site.register(Card)
admin.site.register(Collection)
admin.site.register(Trade)

