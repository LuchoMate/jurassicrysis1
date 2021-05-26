from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator

#User model
class Player(AbstractUser):
    member_since = models.DateField(auto_now_add=timezone.now())
    victories = models.PositiveSmallIntegerField(default = 0)
    losses = models.PositiveSmallIntegerField(default = 0)
    dinocoins = models.PositiveIntegerField(default = 5000)
    xp = models.PositiveSmallIntegerField(default = 0)


#Card model
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
    cost = models.PositiveSmallIntegerField(default=1, 
        validators=[MaxValueValidator(2, 'Maximum 2 energy cost')])
    card_type = models.CharField(max_length=2, choices=type_choices, default='ca')
    weak = models.CharField(max_length=2, choices=type_choices, default='ca')
    rarity = models.CharField(max_length=2, choices=rarity_choices, default='co')
    size = models.CharField(max_length=2, choices=size_choices, default='sm')
    condition_text = models.CharField(max_length=120, blank=True)
    event_effect = models.CharField(max_length=70, blank=True)
    

    def __str__(self):
        return f"[id: {self.id}] -- {self.name} -- {self.card_type}"


#Individual cards collected by players
class Collection(models.Model):
    Owner = models.ForeignKey(Player, on_delete=models.CASCADE, null=True
        ,related_name='player_cards')
    Card_collected = models.ForeignKey(Card, on_delete=models.CASCADE, null=True)
    quantity = models.PositiveSmallIntegerField(default = 1,
        validators=[MinValueValidator(1, 'Cannot have 0 cards on db')])
    on_deck = models.PositiveSmallIntegerField(default=0, 
        validators=[MaxValueValidator(2, 'Maximum 2 per deck')])
       
    class Meta:
        ordering = ('Owner',)
        constraints = [
            models.UniqueConstraint(fields=['Owner', 'Card_collected'], name='individual_card'),
            models.CheckConstraint(name='cannot_have_more_than_quantity',
                check=models.Q(on_deck__lte=models.F('quantity')))
        ]
 
    def __str__(self):
        return f"{self.Owner} owns {self.quantity} of {self.Card_collected} // on deck ---> {self.on_deck}"

#Stores ongoing trade requests
class Trade(models.Model):
    Sender = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='sent_requests')
    Recipient = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='incoming_requests')
    Sender_card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='card_offered')
    Recipient_card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='card_asked')

    class Meta:
        ordering = ('Sender',)
        constraints = [
            models.UniqueConstraint(fields=['Sender', 'Recipient', 'Sender_card','Recipient_card'], name='individual_request'),
            models.CheckConstraint(
            check= ~models.Q(Sender= models.F('Recipient')),
            name='cannot_request_themselves')]
        #further logic will be dealt with in its corresponding Views

    def __str__(self):
        return f"{self.Sender} offers {self.Sender_card} to {self.Recipient} for {self.Recipient_card}"














