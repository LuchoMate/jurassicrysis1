# Generated by Django 3.1.7 on 2021-03-29 17:30

from django.db import migrations, models
import django.db.models.expressions


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0017_auto_20210329_1428'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='collection',
            name='lessEqual_than_quantity',
        ),
        migrations.AddConstraint(
            model_name='collection',
            constraint=models.CheckConstraint(check=models.Q(on_deck__lte=django.db.models.expressions.F('quantity')), name='cannot_have_more_than_quantity'),
        ),
    ]
