from django.shortcuts import render
from django.views.generic import TemplateView, ListView, View, UpdateView
from feedbacker.models import Feature, Tag, User
from feedbacker.forms import FeatureCreateForm, TagCreateForm, UserCreateForm
from django.http import HttpResponse
from django.views.generic.edit import DeleteView

# Create your views here.
categories = ('features', 'tags', 'users')


class IndexView(TemplateView):
    template_name = "feedbacker/index.html"
    extra_context = {'categories': categories}


class FeaturesView(ListView):
    template_name = "feedbacker/features.html"
    model = Feature
    extra_context = {'categories': categories, 'category': 'features'}

class OldFeaturesView(ListView):
    template_name = "feedbacker/features_old.html"
    model = Feature
    extra_context = {'categories': categories, 'category': 'features'}

class FeatureCreateView(View):
    model = Feature
    def post(self, request):
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
    template_name = "feedbacker/edit_form.html"


class FeatureDeleteView(DeleteView):
    # specify the model you want to use
    model = Feature
    template_name = "feedbacker/confirm_delete.html"
    extra_context = {'categories': categories, 'category': 'features', 'entity': 'feature'}
    # can specify success url
    # url to redirect after successfully deleting object
    success_url = "/feedbacker/features"


class TagsView(ListView):
    template_name = "feedbacker/tags.html"
    extra_context = {'categories': categories, 'category': 'tags'}
    model = Tag


class TagCreateView(View):
    model = Tag
    def post(self, request):
        form = TagCreateForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse("Created<script>delayedClose()</script>")
        else:
            return HttpResponse("Invalid name", status=200, reason="Invalid name reason")


class TagEditView(UpdateView):
    model = Tag
    fields = ['name']
    success_url = "/feedbacker/tags"
    template_name = "feedbacker/edit_form.html"


class TagDeleteView(DeleteView):
    # specify the model you want to use
    model = Tag
    extra_context = {'categories': categories, 'category': 'tags', 'entity': 'tag'}
    template_name = "feedbacker/confirm_delete.html"
    success_url = "/feedbacker/tags"


class UsersView(ListView):
    template_name = "feedbacker/users.html"
    extra_context = {'categories': categories, 'category': 'users'}
    model = User

class UserCreateView(View):
    model = User
    def post(self, request):
        form = UserCreateForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse("Created<script>delayedClose()</script>")
        else:
            return HttpResponse("Invalid name", status=200, reason="Invalid name reason")


class UserEditView(UpdateView):
    model = User
    fields = ['name']
    success_url = "/feedbacker/users"
    template_name = "feedbacker/edit_form.html"


class UserDeleteView(DeleteView):
    # specify the model you want to use
    model = User
    extra_context = {'categories': categories, 'category': 'users', 'entity': 'user'}
    template_name = "feedbacker/confirm_delete.html"
    success_url = "/feedbacker/users"
