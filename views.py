from django.shortcuts import render_to_response, HttpResponse, redirect, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from cartoview.app_manager.models import AppInstance, App
from . import APP_NAME
import json
from django.conf import settings
from cartoview_map_viewer import views as viewer_views
from .viewer_widgets import widgets

from django.contrib.auth.decorators import login_required


def view_map(request, instance_id):
    context = dict(widgets=widgets)
    return viewer_views.view_app(request, instance_id, template="%s/view.html" % APP_NAME, context=context)


def map_config(request):
    instance_id = request.GET.get("id")
    instance = AppInstance.objects.get(pk=instance_id)
    config = instance.map.viewer_json(request.user)
    return HttpResponse(json.dumps(config), content_type="application/json")

@login_required
def new(request):
    context = dict(widgets=widgets)
    return viewer_views.new(request, app_name=APP_NAME, context=context)

@login_required
def edit(request, instance_id):
    context = dict(widgets=widgets)
    return viewer_views.edit(request, instance_id, context=context)