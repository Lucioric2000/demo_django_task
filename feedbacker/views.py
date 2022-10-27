from django.shortcuts import render
from django.views.generic import TemplateView, ListView, View, UpdateView
from feedbacker.models import Feature
from feedbacker.forms import FeatureCreateForm
from django.http import HttpResponse

# Create your views here.
categories = ('features', 'tags', 'users')


class IndexView(TemplateView):
    template_name = "feedbacker/index.html"
    extra_context = {'categories': categories}


class FeaturesView(ListView):
    template_name = "feedbacker/features.html"
    model = Feature
    extra_context = {'categories': categories, 'category': 'features'}

class FeatureCreateView(View):
    model = Feature
    def post(self, request):
        print("rp", request.POST, request)
        form = FeatureCreateForm(request.POST)
        if form.is_valid():
            return HttpResponse("Created")
        else:
            return HttpResponse("Invalid name")


class FeatureEditView(UpdateView):
    model = Feature


class TagsView(TemplateView):
    template_name = "feedbacker/tags.html"
    extra_context = {'categories': categories, 'category': 'tags'}


class UsersView(TemplateView):
    template_name = "feedbacker/users.html"
    extra_context = {'categories': categories, 'category': 'users'}
