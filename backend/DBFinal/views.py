from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache


class FrontendView(TemplateView):
    template_name = 'index.html'

index_view = never_cache(FrontendView.as_view())
