from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

def index(request):
    return render(request, "frontend/index.html")

def play(request):
    return render(request, "frontend/play.html")

