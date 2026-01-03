from django.contrib import admin
from .models import (
    Team, Person, Garage, GarageBay, Car, Part, CarPart,
    Session, CarSession, TelemetrySession, WorkOrder, WorkAssignment
)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'principal_name']
    search_fields = ['name', 'country', 'principal_name']
    list_filter = ['country']


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'role', 'team', 'certification_level']
    search_fields = ['first_name', 'last_name', 'role']
    list_filter = ['role', 'team', 'certification_level']
    raw_id_fields = ['team']


class GarageBayInline(admin.TabularInline):
    model = GarageBay
    extra = 0


@admin.register(Garage)
class GarageAdmin(admin.ModelAdmin):
    list_display = ['location', 'team', 'season_year']
    search_fields = ['location']
    list_filter = ['team', 'season_year']
    raw_id_fields = ['team']
    inlines = [GarageBayInline]


@admin.register(GarageBay)
class GarageBayAdmin(admin.ModelAdmin):
    list_display = ['bay_number', 'garage', 'is_active']
    search_fields = ['bay_number']
    list_filter = ['is_active', 'garage']
    raw_id_fields = ['garage']


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ['car_number', 'chassis_number', 'team', 'status']
    search_fields = ['chassis_number', 'car_number']
    list_filter = ['status', 'team']
    raw_id_fields = ['team']


@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ['part_type', 'serial_number', 'manufacturer', 'fia_lifecycle_limit']
    search_fields = ['part_type', 'serial_number', 'manufacturer']
    list_filter = ['part_type', 'manufacturer']


@admin.register(CarPart)
class CarPartAdmin(admin.ModelAdmin):
    list_display = ['car', 'part', 'installed_at', 'removed_at', 'mileage']
    search_fields = ['car__chassis_number', 'part__serial_number']
    list_filter = ['installed_at', 'removed_at']
    raw_id_fields = ['car', 'part']
    date_hierarchy = 'installed_at'


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['race_name', 'session_type', 'session_date']
    search_fields = ['race_name']
    list_filter = ['session_type', 'session_date']
    date_hierarchy = 'session_date'


@admin.register(CarSession)
class CarSessionAdmin(admin.ModelAdmin):
    list_display = ['car', 'session', 'bay', 'status']
    search_fields = ['car__chassis_number', 'session__race_name']
    list_filter = ['status', 'session']
    raw_id_fields = ['car', 'session', 'bay']


@admin.register(TelemetrySession)
class TelemetrySessionAdmin(admin.ModelAdmin):
    list_display = ['car_session', 'start_time', 'end_time', 'data_location']
    search_fields = ['data_location']
    list_filter = ['start_time', 'end_time']
    raw_id_fields = ['car_session']
    date_hierarchy = 'start_time'


class WorkAssignmentInline(admin.TabularInline):
    model = WorkAssignment
    extra = 0
    raw_id_fields = ['person']


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ['work_order_id', 'car', 'session', 'created_at', 'completed_at']
    search_fields = ['description', 'car__chassis_number']
    list_filter = ['created_at', 'completed_at', 'session']
    raw_id_fields = ['car', 'session']
    date_hierarchy = 'created_at'
    inlines = [WorkAssignmentInline]


@admin.register(WorkAssignment)
class WorkAssignmentAdmin(admin.ModelAdmin):
    list_display = ['person', 'work_order', 'role']
    search_fields = ['person__first_name', 'person__last_name', 'role']
    list_filter = ['role']
    raw_id_fields = ['work_order', 'person']
