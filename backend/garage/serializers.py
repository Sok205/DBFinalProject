from rest_framework import serializers
from .models import Team, Car, Part, CarPart, Person, Garage, GarageBay, Session, CarSession


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['team_id', 'name', 'country', 'principal_name']


class CarSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = Car
        fields = ['car_id', 'car_number', 'chassis_number', 'status', 'team', 'team_name']


class PartSerializer(serializers.ModelSerializer):
    lifecycle_percentage = serializers.SerializerMethodField()
    needs_replacement = serializers.SerializerMethodField()
    current_mileage = serializers.SerializerMethodField()
    is_installed = serializers.SerializerMethodField()

    class Meta:
        model = Part
        fields = [
            'part_id', 'part_type', 'serial_number', 'fia_lifecycle_limit',
            'manufacturer', 'lifecycle_percentage', 'needs_replacement',
            'current_mileage', 'is_installed'
        ]

    def get_lifecycle_percentage(self, obj):
        if not obj.fia_lifecycle_limit:
            return None

        active_part = obj.car_parts.filter(removed_at__isnull=True).first()
        if not active_part or not active_part.mileage:
            return 0

        return round((active_part.mileage / obj.fia_lifecycle_limit) * 100, 1)

    def get_needs_replacement(self, obj):
        percentage = self.get_lifecycle_percentage(obj)
        return percentage is not None and percentage >= 80

    def get_current_mileage(self, obj):
        active_part = obj.car_parts.filter(removed_at__isnull=True).first()
        return active_part.mileage if active_part else None

    def get_is_installed(self, obj):
        return obj.car_parts.filter(removed_at__isnull=True).exists()


class CarPartSerializer(serializers.ModelSerializer):
    car_number = serializers.IntegerField(source='car.car_number', read_only=True)
    chassis_number = serializers.CharField(source='car.chassis_number', read_only=True)
    part_type = serializers.CharField(source='part.part_type', read_only=True)
    serial_number = serializers.CharField(source='part.serial_number', read_only=True)
    manufacturer = serializers.CharField(source='part.manufacturer', read_only=True)
    fia_lifecycle_limit = serializers.IntegerField(source='part.fia_lifecycle_limit', read_only=True)
    lifecycle_percentage = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = CarPart
        fields = [
            'car_part_id', 'car', 'part', 'car_number', 'chassis_number',
            'part_type', 'serial_number', 'manufacturer', 'fia_lifecycle_limit',
            'installed_at', 'removed_at', 'mileage', 'lifecycle_percentage',
            'is_active'
        ]

    def get_lifecycle_percentage(self, obj):
        if not obj.part.fia_lifecycle_limit or not obj.mileage:
            return None
        return round((obj.mileage / obj.part.fia_lifecycle_limit) * 100, 1)

    def get_is_active(self, obj):
        return obj.removed_at is None


class CarPartDetailSerializer(CarPartSerializer):
    car_details = CarSerializer(source='car', read_only=True)
    part_details = PartSerializer(source='part', read_only=True)

    class Meta(CarPartSerializer.Meta):
        fields = CarPartSerializer.Meta.fields + ['car_details', 'part_details']


class PersonSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = [
            'person_id', 'first_name', 'last_name', 'full_name',
            'role', 'certification_level', 'team', 'team_name'
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class GarageBaySerializer(serializers.ModelSerializer):
    garage_location = serializers.CharField(source='garage.location', read_only=True)

    class Meta:
        model = GarageBay
        fields = ['bay_id', 'garage', 'garage_location', 'bay_number', 'is_active']


class GarageSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    bays = GarageBaySerializer(many=True, read_only=True)

    class Meta:
        model = Garage
        fields = ['garage_id', 'team', 'team_name', 'location', 'season_year', 'bays']


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['session_id', 'race_name', 'session_type', 'session_date']


class CarSessionSerializer(serializers.ModelSerializer):
    car_number = serializers.IntegerField(source='car.car_number', read_only=True)
    race_name = serializers.CharField(source='session.race_name', read_only=True)
    session_type = serializers.CharField(source='session.session_type', read_only=True)
    bay_number = serializers.IntegerField(source='bay.bay_number', read_only=True)

    class Meta:
        model = CarSession
        fields = [
            'car_session_id', 'car', 'session', 'bay', 'status',
            'car_number', 'race_name', 'session_type', 'bay_number'
        ]
