from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from backend.models import Player, Card, Collection

def test(request):
    return render(request, "frontend/test.html")

def index(request):
    return render(request, "frontend/index.html")

def profile(request, player):
    try:
        thisUser = Player.objects.get(username=player)
    except Player.DoesNotExist:
            return render(request, "frontend/profile.html", {
                "message": "Oops! This user doesn't exist."
            })
    
    thisUserMemberSince = thisUser.member_since
    thisUserId = thisUser.id
    thisUserVictories = thisUser.victories
    thisUserLosses = thisUser.losses
    thisUserXp = thisUser.xp
    
    return render(request, "frontend/profile.html", {
        "thisUser": thisUser,
        "thisUserMemberSince": thisUserMemberSince,
        "thisUserId": thisUserId,
        "thisUserVictories": thisUserVictories,
        "thisUserLosses": thisUserLosses,
        "thisUserXp": thisUserXp
    })

@login_required
def play(request):
    return render(request, "frontend/play.html")

@login_required
def shop(request):
    return render(request, "frontend/shop.html")

@login_required
def mycollection(request):
    return render(request, "frontend/mycollection.html")

@login_required
def deckmanager(request):
    return render(request, "frontend/deckmanager.html")

@login_required
def trader(request):
    return render(request, "frontend/trader.html")

def leaderboards(request):
    return render(request, "frontend/leaderboards.html")

def database(request):
    return render(request, "frontend/database.html")

def devbox(request):
    return render(request, "frontend/devbox.html")

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        password = request.POST["password"]
        if not password:
            return render(request, "frontend/register.html", {
                "message": "Password cannot be empty."
            })

        confirmation = request.POST["confirmation"]
        if password != confirmation:# Ensure password matches confirmation
            return render(request, "frontend/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = Player.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "frontend/register.html", {
                "message": "Username already taken."
            })

        #Assign starter deck to player
        starterdeck=[3,4,7,14,18,19,23,26,33,34,40,42,48,49,52,55,63,64,65,68]
        i=0
        while(i<20):
            cardToAdd = Card.objects.get(id=starterdeck[i])
            newCollection = Collection(Owner = user, Card_collected = cardToAdd, quantity = 1, on_deck = 1)
            newCollection.save()
            i+=1


        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "frontend/register.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication was successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "frontend/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "frontend/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

