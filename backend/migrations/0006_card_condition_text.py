# Generated by Django 3.1.7 on 2021-03-25 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0005_auto_20210323_1035'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='condition_text',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
