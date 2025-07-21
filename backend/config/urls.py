from django.urls import path
from event_search.views import search_events

urlpatterns = [
    path('api/search/', search_events),
]