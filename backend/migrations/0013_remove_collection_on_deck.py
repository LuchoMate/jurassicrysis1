# Generated by Django 3.1.7 on 2021-03-29 15:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0012_auto_20210325_2241'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='collection',
            name='on_deck',
        ),
    ]
