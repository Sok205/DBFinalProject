from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TeamViewSet, CarViewSet, PartViewSet, CarPartViewSet,
    PersonViewSet, GarageViewSet, GarageBayViewSet,
    SessionViewSet, CarSessionViewSet
)

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'cars', CarViewSet, basename='car')
router.register(r'parts', PartViewSet, basename='part')
router.register(r'car-parts', CarPartViewSet, basename='car-part')
router.register(r'people', PersonViewSet, basename='person')
router.register(r'garages', GarageViewSet, basename='garage')
router.register(r'garage-bays', GarageBayViewSet, basename='garage-bay')
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'car-sessions', CarSessionViewSet, basename='car-session')

urlpatterns = [
    path('', include(router.urls)),
]
