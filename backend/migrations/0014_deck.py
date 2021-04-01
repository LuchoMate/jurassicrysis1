# Generated by Django 3.1.7 on 2021-03-29 15:22

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0013_remove_collection_on_deck'),
    ]

    operations = [
        migrations.CreateModel(
            name='Deck',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity_in_deck', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(2, 'Maximum 2 per deck')])),
                ('card_in_deck', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.collection')),
            ],
        ),
    ]