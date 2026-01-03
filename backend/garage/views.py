from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, NumberFilter, CharFilter, BooleanFilter
from .models import Team, Car, Part, CarPart, Person, Garage, GarageBay, Session, CarSession
from .serializers import (
    TeamSerializer, CarSerializer, PartSerializer, CarPartSerializer,
    CarPartDetailSerializer, PersonSerializer, GarageSerializer,
    GarageBaySerializer, SessionSerializer, CarSessionSerializer
)


class PartFilter(FilterSet):
    part_type = CharFilter(lookup_expr='icontains')
    manufacturer = CharFilter(lookup_expr='icontains')
    serial_number = CharFilter(lookup_expr='icontains')

    class Meta:
        model = Part
        fields = ['part_type', 'manufacturer', 'serial_number']


class CarPartFilter(FilterSet):
    car = NumberFilter(field_name='car__car_id')
    part = NumberFilter(field_name='part__part_id')
    is_active = BooleanFilter(method='filter_is_active')
    part_type = CharFilter(field_name='part__part_type', lookup_expr='icontains')

    class Meta:
        model = CarPart
        fields = ['car', 'part', 'is_active', 'part_type']

    def filter_is_active(self, queryset, name, value):
        if value:
            return queryset.filter(removed_at__isnull=True)
        return queryset.filter(removed_at__isnull=False)


class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    search_fields = ['name', 'country']
    ordering_fields = ['name', 'country']


class CarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Car.objects.select_related('team').all()
    serializer_class = CarSerializer
    filterset_fields = ['team', 'status']
    search_fields = ['chassis_number', 'car_number']
    ordering_fields = ['car_number', 'status']


class PartViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Part.objects.prefetch_related('car_parts').all()
    serializer_class = PartSerializer
    filterset_class = PartFilter
    search_fields = ['serial_number', 'part_type', 'manufacturer']
    ordering_fields = ['part_type', 'manufacturer', 'fia_lifecycle_limit']

    @action(detail=False, methods=['get'])
    def lifecycle_warnings(self, request):
        parts_with_warnings = []
        parts = self.get_queryset()

        for part in parts:
            if not part.fia_lifecycle_limit:
                continue

            active_part = part.car_parts.filter(removed_at__isnull=True).first()
            if not active_part or not active_part.mileage:
                continue

            lifecycle_percentage = (active_part.mileage / part.fia_lifecycle_limit) * 100

            if lifecycle_percentage >= 80:
                serializer = self.get_serializer(part)
                parts_with_warnings.append(serializer.data)

        return Response(parts_with_warnings)


class CarPartViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CarPart.objects.select_related('car', 'part', 'car__team').all()
    serializer_class = CarPartSerializer
    filterset_class = CarPartFilter
    search_fields = ['car__chassis_number', 'part__serial_number', 'part__part_type']
    ordering_fields = ['installed_at', 'removed_at', 'mileage']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CarPartDetailSerializer
        return CarPartSerializer

    @action(detail=False, methods=['get'])
    def active(self, request):
        active_parts = self.get_queryset().filter(removed_at__isnull=True)
        page = self.paginate_queryset(active_parts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(active_parts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-car/(?P<car_id>[^/.]+)')
    def by_car(self, request, car_id=None):
        car_parts = self.get_queryset().filter(car_id=car_id).order_by('-installed_at')
        page = self.paginate_queryset(car_parts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(car_parts, many=True)
        return Response(serializer.data)


class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Person.objects.select_related('team').all()
    serializer_class = PersonSerializer
    filterset_fields = ['team', 'role', 'certification_level']
    search_fields = ['first_name', 'last_name', 'role']
    ordering_fields = ['last_name', 'first_name', 'role']


class GarageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Garage.objects.select_related('team').prefetch_related('bays').all()
    serializer_class = GarageSerializer
    filterset_fields = ['team', 'season_year']
    search_fields = ['location']
    ordering_fields = ['season_year', 'location']


class GarageBayViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GarageBay.objects.select_related('garage').all()
    serializer_class = GarageBaySerializer
    filterset_fields = ['garage', 'is_active']
    ordering_fields = ['bay_number']


class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    filterset_fields = ['session_type']
    search_fields = ['race_name']
    ordering_fields = ['session_date', 'race_name']


class CarSessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CarSession.objects.select_related('car', 'session', 'bay').all()
    serializer_class = CarSessionSerializer
    filterset_fields = ['car', 'session', 'status']
    ordering_fields = ['session', 'car']
