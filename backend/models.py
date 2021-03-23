from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Player(AbstractUser):
    member_since = models.DateField(auto_now_add=timezone.now())
    victories = models.PositiveSmallIntegerField(default = 0)
    losses = models.PositiveSmallIntegerField(default = 0)
    dinocoins = models.PositiveSmallIntegerField(default = 0)