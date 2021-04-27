from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from backend.models import Player, Card

def test(request):
    return render(request, "frontend/test.html")

def index(request):
    return render(request, "frontend/index.html")

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

