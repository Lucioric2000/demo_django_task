from __future__ import annotations

from django import forms
from feedbacker import models


class FeatureCreateForm(forms.ModelForm):
    class Meta:
        model = models.Feature
        fields = ['name']

