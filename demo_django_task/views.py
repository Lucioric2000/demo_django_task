from django.views.generic import TemplateView
from feedbacker.models import Project

class IndexView(TemplateView):
    template_name = "demo_django_task/projects.html"
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['projects'] = Project.objects.all()
        return context