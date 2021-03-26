from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.validators import MaxValueValidator

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
    life_points = models.PositiveSmallIntegerField(default = 0)
    card_type = models.CharField(max_length=2, choices=type_choices, default='ca')
    rarity = models.CharField(max_length=2, choices=rarity_choices, default='co')
    size = models.CharField(max_length=2, choices=size_choices, default='sm')
    condition_text = models.CharField(max_length=50, blank=True)
    effect_text = models.CharField(max_length=200, blank=True)
    img_src = models.CharField(max_length=200, blank=True)
    intro_sound = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.name} -- {self.card_type}"


#individual cards collected by players
class Collection(models.Model):
    Owner = models.ForeignKey(Player, on_delete=models.CASCADE, null=True)
    Card_collected = models.ForeignKey(Card, on_delete=models.CASCADE, null=True)
    quantity = models.PositiveSmallIntegerField(default = 1)
    on_deck = models.PositiveSmallIntegerField(default = 0,
     validators=[MaxValueValidator(2, 'Maximum 2 per deck')])

    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['Owner', 'Card_collected'], name='individual_card')
        ]

    

    def __str__(self):
        return f"{self.Owner} owns {self.quantity} of {self.Card_collected}"













