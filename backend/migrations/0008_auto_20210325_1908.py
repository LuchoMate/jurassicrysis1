# Generated by Django 3.1.7 on 2021-03-25 22:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0007_auto_20210325_1330'),
    ]

    operations = [
        migrations.RenameField(
            model_name='card',
            old_name='life',
            new_name='life_points',
        ),
    ]
