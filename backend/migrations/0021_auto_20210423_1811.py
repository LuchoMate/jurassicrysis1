# Generated by Django 3.1.7 on 2021-04-23 22:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0020_card_cost'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='img_src',
        ),
        migrations.RemoveField(
            model_name='card',
            name='intro_sound',
        ),
    ]
