from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('garage', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='car',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='carpart',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='carsession',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='garage',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='garagebay',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='part',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='person',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='session',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='team',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='telemetrysession',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='workassignment',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='workorder',
            options={'managed': True},
        ),
    ]
