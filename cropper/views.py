from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.
class IndexView(TemplateView):
    template_name = 'cropper/index.html'
    #def get_context_data(self, **kwargs):
    #    context = super().get_context_data(**kwargs)
    #    context['message'] = 'Hello World'
    #    return context
    #pass
