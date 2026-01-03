from django.db import models


class Team(models.Model):
    team_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True, null=True)
    principal_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'team'
        managed = False

    def __str__(self):
        return self.name


class Person(models.Model):
    person_id = models.AutoField(primary_key=True)
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        db_column='team_id',
        related_name='people'
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    certification_level = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'person'
        managed = False

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Garage(models.Model):
    garage_id = models.AutoField(primary_key=True)
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        db_column='team_id',
        related_name='garages'
    )
    location = models.CharField(max_length=100)
    season_year = models.IntegerField()

    class Meta:
        db_table = 'garage'
        managed = False

    def __str__(self):
        return f"{self.team.name} - {self.location} ({self.season_year})"


class GarageBay(models.Model):
    bay_id = models.AutoField(primary_key=True)
    garage = models.ForeignKey(
        Garage,
        on_delete=models.CASCADE,
        db_column='garage_id',
        related_name='bays'
    )
    bay_number = models.IntegerField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'garage_bay'
        managed = False

    def __str__(self):
        return f"Bay {self.bay_number} - {self.garage.location}"


class Car(models.Model):
    car_id = models.AutoField(primary_key=True)
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        db_column='team_id',
        related_name='cars'
    )
    car_number = models.IntegerField()
    chassis_number = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=50)

    class Meta:
        db_table = 'car'
        managed = False

    def __str__(self):
        return f"Car #{self.car_number} - {self.chassis_number}"


class Part(models.Model):
    part_id = models.AutoField(primary_key=True)
    part_type = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)
    fia_lifecycle_limit = models.IntegerField(blank=True, null=True)
    manufacturer = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'part'
        managed = False

    def __str__(self):
        return f"{self.part_type} - {self.serial_number}"


class CarPart(models.Model):
    car_part_id = models.AutoField(primary_key=True)
    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        db_column='car_id',
        related_name='car_parts'
    )
    part = models.ForeignKey(
        Part,
        on_delete=models.CASCADE,
        db_column='part_id',
        related_name='car_parts'
    )
    installed_at = models.DateTimeField()
    removed_at = models.DateTimeField(blank=True, null=True)
    mileage = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'car_part'
        managed = False

    def __str__(self):
        return f"{self.part.part_type} on {self.car}"


class Session(models.Model):
    session_id = models.AutoField(primary_key=True)
    race_name = models.CharField(max_length=100)
    session_type = models.CharField(max_length=10)
    session_date = models.DateField()

    class Meta:
        db_table = 'session'
        managed = False

    def __str__(self):
        return f"{self.race_name} - {self.session_type}"


class CarSession(models.Model):
    car_session_id = models.AutoField(primary_key=True)
    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        db_column='car_id',
        related_name='car_sessions'
    )
    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
        db_column='session_id',
        related_name='car_sessions'
    )
    bay = models.ForeignKey(
        GarageBay,
        on_delete=models.SET_NULL,
        db_column='bay_id',
        related_name='car_sessions',
        blank=True,
        null=True
    )
    status = models.CharField(max_length=50)

    class Meta:
        db_table = 'car_session'
        managed = False

    def __str__(self):
        return f"{self.car} - {self.session}"


class TelemetrySession(models.Model):
    telemetry_id = models.AutoField(primary_key=True)
    car_session = models.ForeignKey(
        CarSession,
        on_delete=models.CASCADE,
        db_column='car_session_id',
        related_name='telemetry_sessions'
    )
    data_location = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'telemetry_session'
        managed = False

    def __str__(self):
        return f"Telemetry for {self.car_session}"


class WorkOrder(models.Model):
    work_order_id = models.AutoField(primary_key=True)
    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        db_column='car_id',
        related_name='work_orders'
    )
    session = models.ForeignKey(
        Session,
        on_delete=models.SET_NULL,
        db_column='session_id',
        related_name='work_orders',
        blank=True,
        null=True
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'work_order'
        managed = False

    def __str__(self):
        return f"Work Order #{self.work_order_id} - {self.car}"


class WorkAssignment(models.Model):
    work_assignment_id = models.AutoField(primary_key=True)
    work_order = models.ForeignKey(
        WorkOrder,
        on_delete=models.CASCADE,
        db_column='work_order_id',
        related_name='assignments'
    )
    person = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        db_column='person_id',
        related_name='work_assignments'
    )
    role = models.CharField(max_length=50)

    class Meta:
        db_table = 'work_assignment'
        managed = False

    def __str__(self):
        return f"{self.person} - {self.work_order}"
