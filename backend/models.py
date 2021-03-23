from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Player(AbstractUser):
    member_since = models.DateField(auto_now_add=timezone.now())
    victories = models.PositiveSmallIntegerField(default = 0)
    losses = models.PositiveSmallIntegerField(default = 0)
    dinocoins = models.PositiveIntegerField(default = 5000)
    level = models.PositiveSmallIntegerField(default = 1)

class Card(models.Model):

    type_choices = [
        ('ca', 'Carnivorous'),
        ('he', 'Herbivore'),
        ('aq', 'Aquatic'),
        ('fl', 'Flying'),
        ('ev', 'Event')
    ]

    rarity_choices = [
        ('co', 'Common'),
        ('sc', 'Scarce'),
        ('ex', 'Exceptional')
    ]

    size_choices = [
        ('sm', 'Small'),
        ('me', 'Medium'),
        ('la', 'Large')
    ]

    name = models.CharField(max_length=30)
    attack = models.PositiveSmallIntegerField(default = 0)
    life = models.PositiveSmallIntegerField(default = 0)
    card_type = models.CharField(max_length=2, choices=type_choices, default='ca')
    rarity = models.CharField(max_length=2, choices=rarity_choices, default='co')
    size = models.CharField(max_length=2, choices=size_choices, default='sm')
    effect_text = models.CharField(max_length=200, blank=True)
    img_src = models.CharField(max_length=200, blank=True)
    attack_sound = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{ self.id} -- {self.name} -- {self.card_type}"








