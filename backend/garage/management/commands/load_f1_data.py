"""
Management command to load genuine F1 parts and team data for simulation.
"""
from django.core.management.base import BaseCommand
from django.db import connection
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Load genuine F1 teams, cars, and parts data'

    def handle(self, *args, **options):
        self.stdout.write('Loading F1 data...')

        with connection.cursor() as cursor:
            self.stdout.write('Clearing existing data...')
            cursor.execute('DELETE FROM car_part')
            cursor.execute('DELETE FROM part')
            cursor.execute('DELETE FROM car')
            cursor.execute('DELETE FROM garage_bay')
            cursor.execute('DELETE FROM garage')
            cursor.execute('DELETE FROM person')
            cursor.execute('DELETE FROM team')

            teams = [
                ('Red Bull Racing', 'Austria', 'Christian Horner'),
                ('Ferrari', 'Italy', 'Frédéric Vasseur'),
                ('Mercedes-AMG Petronas', 'Germany', 'Toto Wolff'),
                ('McLaren', 'United Kingdom', 'Andrea Stella'),
                ('Aston Martin', 'United Kingdom', 'Mike Krack'),
                ('Alpine', 'France', 'Bruno Famin'),
                ('Williams', 'United Kingdom', 'James Vowles'),
                ('AlphaTauri', 'Italy', 'Laurent Mekies'),
                ('Alfa Romeo', 'Switzerland', 'Alessandro Alunni Bravi'),
                ('Haas', 'United States', 'Guenther Steiner'),
            ]

            self.stdout.write('Inserting teams...')
            for name, country, principal in teams:
                cursor.execute(
                    'INSERT INTO team (name, country, principal_name) VALUES (%s, %s, %s)',
                    [name, country, principal]
                )

            cursor.execute('SELECT team_id, name FROM team')
            team_map = {name: tid for tid, name in cursor.fetchall()}

            cars_data = [
                # Red Bull
                (team_map['Red Bull Racing'], 1, 'RB20-01', 'Active'),
                (team_map['Red Bull Racing'], 11, 'RB20-02', 'Active'),
                # Ferrari
                (team_map['Ferrari'], 16, 'SF-24-01', 'Active'),
                (team_map['Ferrari'], 55, 'SF-24-02', 'Active'),
                # Mercedes
                (team_map['Mercedes-AMG Petronas'], 44, 'W15-01', 'Active'),
                (team_map['Mercedes-AMG Petronas'], 63, 'W15-02', 'Active'),
                # McLaren
                (team_map['McLaren'], 4, 'MCL38-01', 'Active'),
                (team_map['McLaren'], 81, 'MCL38-02', 'Active'),
                # Aston Martin
                (team_map['Aston Martin'], 14, 'AMR24-01', 'Active'),
                (team_map['Aston Martin'], 18, 'AMR24-02', 'Active'),
            ]

            self.stdout.write('Inserting cars...')
            for team_id, car_num, chassis, status in cars_data:
                cursor.execute(
                    'INSERT INTO car (team_id, car_number, chassis_number, status) VALUES (%s, %s, %s, %s)',
                    [team_id, car_num, chassis, status]
                )

            # Get car IDs
            cursor.execute('SELECT car_id, chassis_number FROM car')
            car_map = {chassis: cid for cid, chassis in cursor.fetchall()}

            # Insert Garages
            self.stdout.write('Inserting garages...')
            locations = ['Bahrain', 'Saudi Arabia', 'Australia', 'Japan', 'China', 'Miami']
            for team_name, team_id in team_map.items():
                for location in locations[:3]:  # 3 garages per team
                    cursor.execute(
                        'INSERT INTO garage (team_id, location, season_year) VALUES (%s, %s, %s)',
                        [team_id, location, 2024]
                    )

            # Parts data - genuine F1 components with FIA lifecycle limits
            parts_data = [
                # Power Unit Components (ICE - Internal Combustion Engine)
                ('Internal Combustion Engine', 'Honda RBPTH001', 7000, 'Honda RBPT'),
                ('Internal Combustion Engine', 'Honda RBPTH002', 7000, 'Honda RBPT'),
                ('Internal Combustion Engine', 'Ferrari 066/12-001', 7000, 'Ferrari'),
                ('Internal Combustion Engine', 'Ferrari 066/12-002', 7000, 'Ferrari'),
                ('Internal Combustion Engine', 'Mercedes M15-001', 7000, 'Mercedes HPP'),
                ('Internal Combustion Engine', 'Mercedes M15-002', 7000, 'Mercedes HPP'),
                ('Internal Combustion Engine', 'Mercedes M15-003', 7000, 'Mercedes HPP'),
                ('Internal Combustion Engine', 'Renault E-Tech RE24-001', 7000, 'Renault'),

                # Turbochargers
                ('Turbocharger', 'TC-RB-2024-001', 7000, 'Honda RBPT'),
                ('Turbocharger', 'TC-RB-2024-002', 7000, 'Honda RBPT'),
                ('Turbocharger', 'TC-FER-2024-001', 7000, 'Ferrari'),
                ('Turbocharger', 'TC-FER-2024-002', 7000, 'Ferrari'),
                ('Turbocharger', 'TC-MER-2024-001', 7000, 'Mercedes HPP'),
                ('Turbocharger', 'TC-MER-2024-002', 7000, 'Mercedes HPP'),

                # MGU-K (Motor Generator Unit - Kinetic)
                ('MGU-K', 'MGUK-RB-001', 7000, 'Honda RBPT'),
                ('MGU-K', 'MGUK-RB-002', 7000, 'Honda RBPT'),
                ('MGU-K', 'MGUK-FER-001', 7000, 'Ferrari'),
                ('MGU-K', 'MGUK-FER-002', 7000, 'Ferrari'),
                ('MGU-K', 'MGUK-MER-001', 7000, 'Mercedes HPP'),
                ('MGU-K', 'MGUK-MER-002', 7000, 'Mercedes HPP'),

                # MGU-H (Motor Generator Unit - Heat)
                ('MGU-H', 'MGUH-RB-001', 7000, 'Honda RBPT'),
                ('MGU-H', 'MGUH-RB-002', 7000, 'Honda RBPT'),
                ('MGU-H', 'MGUH-FER-001', 7000, 'Ferrari'),
                ('MGU-H', 'MGUH-MER-001', 7000, 'Mercedes HPP'),

                # Energy Store (Battery)
                ('Energy Store', 'ES-RB-2024-001', 8000, 'Honda RBPT'),
                ('Energy Store', 'ES-RB-2024-002', 8000, 'Honda RBPT'),
                ('Energy Store', 'ES-FER-2024-001', 8000, 'Ferrari'),
                ('Energy Store', 'ES-MER-2024-001', 8000, 'Mercedes HPP'),
                ('Energy Store', 'ES-MER-2024-002', 8000, 'Mercedes HPP'),

                # Control Electronics
                ('Control Electronics', 'CE-STD-2024-001', 10000, 'McLaren Applied'),
                ('Control Electronics', 'CE-STD-2024-002', 10000, 'McLaren Applied'),
                ('Control Electronics', 'CE-STD-2024-003', 10000, 'McLaren Applied'),
                ('Control Electronics', 'CE-STD-2024-004', 10000, 'McLaren Applied'),

                # Gearbox
                ('Gearbox', 'GB-RB-2024-001', 6000, 'Red Bull Technology'),
                ('Gearbox', 'GB-RB-2024-002', 6000, 'Red Bull Technology'),
                ('Gearbox', 'GB-FER-2024-001', 6000, 'Ferrari'),
                ('Gearbox', 'GB-FER-2024-002', 6000, 'Ferrari'),
                ('Gearbox', 'GB-MER-2024-001', 6000, 'Mercedes'),
                ('Gearbox', 'GB-MER-2024-002', 6000, 'Mercedes'),
                ('Gearbox', 'GB-MCL-2024-001', 6000, 'McLaren'),
                ('Gearbox', 'GB-MCL-2024-002', 6000, 'McLaren'),

                # Front Wings
                ('Front Wing', 'FW-RB20-001', 5000, 'Red Bull Technology'),
                ('Front Wing', 'FW-RB20-002', 5000, 'Red Bull Technology'),
                ('Front Wing', 'FW-RB20-003', 5000, 'Red Bull Technology'),
                ('Front Wing', 'FW-SF24-001', 5000, 'Ferrari'),
                ('Front Wing', 'FW-SF24-002', 5000, 'Ferrari'),
                ('Front Wing', 'FW-W15-001', 5000, 'Mercedes'),
                ('Front Wing', 'FW-W15-002', 5000, 'Mercedes'),
                ('Front Wing', 'FW-MCL38-001', 5000, 'McLaren'),
                ('Front Wing', 'FW-MCL38-002', 5000, 'McLaren'),

                # Rear Wings
                ('Rear Wing', 'RW-RB20-LOW-001', 5000, 'Red Bull Technology'),
                ('Rear Wing', 'RW-RB20-HIGH-001', 5000, 'Red Bull Technology'),
                ('Rear Wing', 'RW-SF24-LOW-001', 5000, 'Ferrari'),
                ('Rear Wing', 'RW-SF24-HIGH-001', 5000, 'Ferrari'),
                ('Rear Wing', 'RW-W15-LOW-001', 5000, 'Mercedes'),
                ('Rear Wing', 'RW-MCL38-LOW-001', 5000, 'McLaren'),

                # Floor/Diffuser
                ('Floor Assembly', 'FLOOR-RB20-001', 8000, 'Red Bull Technology'),
                ('Floor Assembly', 'FLOOR-RB20-002', 8000, 'Red Bull Technology'),
                ('Floor Assembly', 'FLOOR-SF24-001', 8000, 'Ferrari'),
                ('Floor Assembly', 'FLOOR-W15-001', 8000, 'Mercedes'),
                ('Floor Assembly', 'FLOOR-MCL38-001', 8000, 'McLaren'),

                # Brake Systems
                ('Front Brake Assembly', 'BRK-F-BRE-001', 3000, 'Brembo'),
                ('Front Brake Assembly', 'BRK-F-BRE-002', 3000, 'Brembo'),
                ('Front Brake Assembly', 'BRK-F-BRE-003', 3000, 'Brembo'),
                ('Front Brake Assembly', 'BRK-F-BRE-004', 3000, 'Brembo'),
                ('Rear Brake Assembly', 'BRK-R-BRE-001', 3000, 'Brembo'),
                ('Rear Brake Assembly', 'BRK-R-BRE-002', 3000, 'Brembo'),
                ('Rear Brake Assembly', 'BRK-R-BRE-003', 3000, 'Brembo'),
                ('Rear Brake Assembly', 'BRK-R-AP-001', 3000, 'AP Racing'),
                ('Rear Brake Assembly', 'BRK-R-AP-002', 3000, 'AP Racing'),

                # Suspension
                ('Front Suspension', 'SUSP-F-RB-001', 4000, 'Red Bull Technology'),
                ('Front Suspension', 'SUSP-F-RB-002', 4000, 'Red Bull Technology'),
                ('Front Suspension', 'SUSP-F-FER-001', 4000, 'Ferrari'),
                ('Front Suspension', 'SUSP-F-MER-001', 4000, 'Mercedes'),
                ('Rear Suspension', 'SUSP-R-RB-001', 4000, 'Red Bull Technology'),
                ('Rear Suspension', 'SUSP-R-FER-001', 4000, 'Ferrari'),
                ('Rear Suspension', 'SUSP-R-MER-001', 4000, 'Mercedes'),

                # Steering
                ('Steering Rack', 'STEER-RB-001', 5000, 'Red Bull Technology'),
                ('Steering Rack', 'STEER-FER-001', 5000, 'Ferrari'),
                ('Steering Rack', 'STEER-MER-001', 5000, 'Mercedes'),
                ('Steering Rack', 'STEER-MCL-001', 5000, 'McLaren'),

                # Wheels
                ('Wheel Set - Front', 'WHL-F-BBS-001', 2000, 'BBS'),
                ('Wheel Set - Front', 'WHL-F-BBS-002', 2000, 'BBS'),
                ('Wheel Set - Front', 'WHL-F-BBS-003', 2000, 'BBS'),
                ('Wheel Set - Front', 'WHL-F-OZ-001', 2000, 'OZ Racing'),
                ('Wheel Set - Front', 'WHL-F-OZ-002', 2000, 'OZ Racing'),
                ('Wheel Set - Rear', 'WHL-R-BBS-001', 2000, 'BBS'),
                ('Wheel Set - Rear', 'WHL-R-BBS-002', 2000, 'BBS'),
                ('Wheel Set - Rear', 'WHL-R-OZ-001', 2000, 'OZ Racing'),

                # Exhaust
                ('Exhaust System', 'EXH-RB-001', 6000, 'Inconel Alloys'),
                ('Exhaust System', 'EXH-FER-001', 6000, 'Ferrari'),
                ('Exhaust System', 'EXH-MER-001', 6000, 'Mercedes'),

                # Sidepods
                ('Sidepod Assembly', 'SIDE-RB20-001', 10000, 'Red Bull Technology'),
                ('Sidepod Assembly', 'SIDE-SF24-001', 10000, 'Ferrari'),
                ('Sidepod Assembly', 'SIDE-W15-001', 10000, 'Mercedes'),
                ('Sidepod Assembly', 'SIDE-MCL38-001', 10000, 'McLaren'),

                # Halo
                ('Halo Device', 'HALO-STD-001', 50000, 'CP Tech'),
                ('Halo Device', 'HALO-STD-002', 50000, 'CP Tech'),
                ('Halo Device', 'HALO-STD-003', 50000, 'CP Tech'),
                ('Halo Device', 'HALO-STD-004', 50000, 'CP Tech'),
            ]

            self.stdout.write('Inserting parts...')
            for part_type, serial, limit, manufacturer in parts_data:
                cursor.execute(
                    'INSERT INTO part (part_type, serial_number, fia_lifecycle_limit, manufacturer) VALUES (%s, %s, %s, %s)',
                    [part_type, serial, limit, manufacturer]
                )

            # Get part IDs
            cursor.execute('SELECT part_id, serial_number FROM part')
            part_map = {serial: pid for pid, serial in cursor.fetchall()}

            # Install parts on cars with varying mileage
            self.stdout.write('Installing parts on cars...')
            car_part_installs = [
                # Red Bull RB20-01 (Verstappen)
                ('RB20-01', 'Honda RBPTH001', 4500),
                ('RB20-01', 'TC-RB-2024-001', 4500),
                ('RB20-01', 'MGUK-RB-001', 4500),
                ('RB20-01', 'MGUH-RB-001', 4500),
                ('RB20-01', 'ES-RB-2024-001', 5200),
                ('RB20-01', 'GB-RB-2024-001', 3800),
                ('RB20-01', 'FW-RB20-001', 2100),
                ('RB20-01', 'RW-RB20-LOW-001', 1800),
                ('RB20-01', 'FLOOR-RB20-001', 4200),
                ('RB20-01', 'BRK-F-BRE-001', 1200),
                ('RB20-01', 'BRK-R-BRE-001', 1200),
                ('RB20-01', 'SUSP-F-RB-001', 2800),
                ('RB20-01', 'SUSP-R-RB-001', 2800),
                ('RB20-01', 'STEER-RB-001', 3100),
                ('RB20-01', 'WHL-F-BBS-001', 800),
                ('RB20-01', 'WHL-R-BBS-001', 800),
                ('RB20-01', 'EXH-RB-001', 4100),
                ('RB20-01', 'SIDE-RB20-001', 4500),
                ('RB20-01', 'HALO-STD-001', 4500),

                # Red Bull RB20-02 (Perez)
                ('RB20-02', 'Honda RBPTH002', 4200),
                ('RB20-02', 'TC-RB-2024-002', 4200),
                ('RB20-02', 'MGUK-RB-002', 4200),
                ('RB20-02', 'MGUH-RB-002', 4200),
                ('RB20-02', 'ES-RB-2024-002', 4800),
                ('RB20-02', 'GB-RB-2024-002', 3500),
                ('RB20-02', 'FW-RB20-002', 1900),
                ('RB20-02', 'RW-RB20-HIGH-001', 1600),
                ('RB20-02', 'FLOOR-RB20-002', 3900),
                ('RB20-02', 'BRK-F-BRE-002', 1100),
                ('RB20-02', 'BRK-R-BRE-002', 1100),
                ('RB20-02', 'SUSP-F-RB-002', 2600),
                ('RB20-02', 'WHL-F-BBS-002', 750),
                ('RB20-02', 'WHL-R-BBS-002', 750),
                ('RB20-02', 'HALO-STD-002', 4200),

                # Ferrari SF-24-01 (Leclerc)
                ('SF-24-01', 'Ferrari 066/12-001', 5800),
                ('SF-24-01', 'TC-FER-2024-001', 5800),
                ('SF-24-01', 'MGUK-FER-001', 5800),
                ('SF-24-01', 'MGUH-FER-001', 5800),
                ('SF-24-01', 'ES-FER-2024-001', 6500),
                ('SF-24-01', 'GB-FER-2024-001', 4200),
                ('SF-24-01', 'FW-SF24-001', 2400),
                ('SF-24-01', 'RW-SF24-LOW-001', 2100),
                ('SF-24-01', 'FLOOR-SF24-001', 4800),
                ('SF-24-01', 'BRK-F-BRE-003', 2400),
                ('SF-24-01', 'BRK-R-BRE-003', 2400),
                ('SF-24-01', 'SUSP-F-FER-001', 3200),
                ('SF-24-01', 'SUSP-R-FER-001', 3200),
                ('SF-24-01', 'STEER-FER-001', 3600),
                ('SF-24-01', 'WHL-F-OZ-001', 900),
                ('SF-24-01', 'WHL-R-OZ-001', 900),
                ('SF-24-01', 'EXH-FER-001', 4600),
                ('SF-24-01', 'SIDE-SF24-001', 5200),
                ('SF-24-01', 'HALO-STD-003', 5800),

                # Ferrari SF-24-02 (Sainz)
                ('SF-24-02', 'Ferrari 066/12-002', 5500),
                ('SF-24-02', 'TC-FER-2024-002', 5500),
                ('SF-24-02', 'MGUK-FER-002', 5500),
                ('SF-24-02', 'GB-FER-2024-002', 4000),
                ('SF-24-02', 'FW-SF24-002', 2200),
                ('SF-24-02', 'RW-SF24-HIGH-001', 1900),
                ('SF-24-02', 'BRK-F-BRE-004', 2200),
                ('SF-24-02', 'WHL-F-OZ-002', 850),

                # Mercedes W15-01 (Hamilton)
                ('W15-01', 'Mercedes M15-001', 6200),
                ('W15-01', 'TC-MER-2024-001', 6200),
                ('W15-01', 'MGUK-MER-001', 6200),
                ('W15-01', 'MGUH-MER-001', 6200),
                ('W15-01', 'ES-MER-2024-001', 7100),
                ('W15-01', 'GB-MER-2024-001', 4800),
                ('W15-01', 'FW-W15-001', 2800),
                ('W15-01', 'RW-W15-LOW-001', 2500),
                ('W15-01', 'FLOOR-W15-001', 5400),
                ('W15-01', 'BRK-R-AP-001', 2100),
                ('W15-01', 'SUSP-F-MER-001', 3600),
                ('W15-01', 'SUSP-R-MER-001', 3600),
                ('W15-01', 'STEER-MER-001', 4000),
                ('W15-01', 'WHL-F-BBS-003', 950),
                ('W15-01', 'EXH-MER-001', 5000),
                ('W15-01', 'SIDE-W15-001', 5800),
                ('W15-01', 'HALO-STD-004', 6200),

                # Mercedes W15-02 (Russell)
                ('W15-02', 'Mercedes M15-002', 5900),
                ('W15-02', 'TC-MER-2024-002', 5900),
                ('W15-02', 'MGUK-MER-002', 5900),
                ('W15-02', 'ES-MER-2024-002', 6800),
                ('W15-02', 'GB-MER-2024-002', 4500),
                ('W15-02', 'FW-W15-002', 2600),
                ('W15-02', 'BRK-R-AP-002', 1900),

                # McLaren MCL38-01 (Norris)
                ('MCL38-01', 'Mercedes M15-003', 4800),
                ('MCL38-01', 'CE-STD-2024-001', 4800),
                ('MCL38-01', 'GB-MCL-2024-001', 3600),
                ('MCL38-01', 'FW-MCL38-001', 2000),
                ('MCL38-01', 'RW-MCL38-LOW-001', 1700),
                ('MCL38-01', 'FLOOR-MCL38-001', 4000),
                ('MCL38-01', 'STEER-MCL-001', 3400),
                ('MCL38-01', 'SIDE-MCL38-001', 4200),

                # McLaren MCL38-02 (Piastri)
                ('MCL38-02', 'CE-STD-2024-002', 4500),
                ('MCL38-02', 'GB-MCL-2024-002', 3400),
                ('MCL38-02', 'FW-MCL38-002', 1800),
            ]

            base_date = datetime.now() - timedelta(days=120)

            for chassis, serial, mileage in car_part_installs:
                if chassis in car_map and serial in part_map:
                    install_date = base_date + timedelta(days=random.randint(0, 30))
                    cursor.execute(
                        'INSERT INTO car_part (car_id, part_id, installed_at, mileage) VALUES (%s, %s, %s, %s)',
                        [car_map[chassis], part_map[serial], install_date, mileage]
                    )

            # Add some personnel
            self.stdout.write('Inserting personnel...')
            personnel = [
                (team_map['Red Bull Racing'], 'Adrian', 'Newey', 'Chief Technical Officer', 'Master'),
                (team_map['Red Bull Racing'], 'Pierre', 'Waché', 'Technical Director', 'Senior'),
                (team_map['Red Bull Racing'], 'Lee', 'Stevenson', 'Race Engineer #1', 'Senior'),
                (team_map['Ferrari'], 'Enrico', 'Cardile', 'Technical Director', 'Senior'),
                (team_map['Ferrari'], 'Riccardo', 'Adami', 'Race Engineer #16', 'Senior'),
                (team_map['Mercedes-AMG Petronas'], 'James', 'Allison', 'Technical Director', 'Master'),
                (team_map['Mercedes-AMG Petronas'], 'Andrew', 'Shovlin', 'Trackside Engineering Director', 'Senior'),
                (team_map['McLaren'], 'Peter', 'Prodromou', 'Technical Director', 'Senior'),
                (team_map['McLaren'], 'Will', 'Joseph', 'Race Engineer #4', 'Senior'),
            ]

            for team_id, first, last, role, cert in personnel:
                cursor.execute(
                    'INSERT INTO person (team_id, first_name, last_name, role, certification_level) VALUES (%s, %s, %s, %s, %s)',
                    [team_id, first, last, role, cert]
                )

        self.stdout.write(self.style.SUCCESS('Successfully loaded F1 data!'))
        self.stdout.write(f'  - {len(teams)} teams')
        self.stdout.write(f'  - {len(cars_data)} cars')
        self.stdout.write(f'  - {len(parts_data)} parts')
        self.stdout.write(f'  - {len(car_part_installs)} part installations')
