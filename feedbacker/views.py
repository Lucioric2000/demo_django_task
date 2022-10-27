from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.
categories = ('features', 'tags', 'users')
class IndexView(TemplateView):
    template_name = "feedbacker/index.html"
    extra_context = {'categories': categories}

class FeaturesView(TemplateView):
    template_name = "feedbacker/features.html"
    extra_context = {'categories': categories, 'category': 'features'}

class TagsView(TemplateView):
    template_name = "feedbacker/tags.html"
    extra_context = {'categories': categories, 'category': 'tags'}

class UsersView(TemplateView):
    template_name = "feedbacker/users.html"
    extra_context = {'categories': categories, 'category': 'users'}
