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
            form.save()
            return HttpResponse("Created<script>delayedClose()</script>")
        else:
            return HttpResponse("Invalid name", status=200, reason="Invalid name reason")


class FeatureEditView(UpdateView):
    model = Feature
    fields = ['name', 'description']
    success_url = "/feedbacker/features"


# import generic UpdateView
from django.views.generic.edit import DeleteView


class FeatureDeleteView(DeleteView):
    # specify the model you want to use
    model = Feature

    # can specify success url
    # url to redirect after successfully
    # deleting object
    success_url = "/feedbacker/features"



class TagsView(TemplateView):
    template_name = "feedbacker/tags.html"
    extra_context = {'categories': categories, 'category': 'tags'}


class UsersView(TemplateView):
    template_name = "feedbacker/users.html"
    extra_context = {'categories': categories, 'category': 'users'}
