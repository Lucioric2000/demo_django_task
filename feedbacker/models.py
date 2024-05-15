from django.db import models
from django.urls import reverse


# Create your models here.
class Feature(models.Model):
    name = models.CharField(max_length=80, unique=True)
    description = models.TextField(default="")
    def get_absolute_url(self):
        return reverse('feedbacker:feature_edit', kwargs={'pk': self.id})


class Tag(models.Model):
    name = models.CharField(max_length=80, unique=True)


class Project(models.Model):
    name = models.CharField(max_length=80, unique=True)
    description = models.TextField()
    url = models.URLField()