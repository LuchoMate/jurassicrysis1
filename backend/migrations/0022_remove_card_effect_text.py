# Generated by Django 3.1.7 on 2021-04-26 02:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0021_auto_20210423_1811'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='effect_text',
        ),
    ]
