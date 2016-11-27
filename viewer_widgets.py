from django.templatetags.static import static
from . import APP_NAME

widgets = [{
    'title': 'Charts Viewer',
    'name': 'ChartsViewer',

    'config': {
        'directive': 'charts-viewer-config',
        'js': [
            static("%s/js/config/charts-viewer-directive.js" % APP_NAME),
        ],
        "css": [
            static("%s/css/config.css" % APP_NAME),
        ]
    },
    'view': {
        'directive': 'charts-viewer',
        'js': [
            static("%s/js/view/app.js" % APP_NAME),
            static("%s/js/view/main-controller.js" % APP_NAME),
            static("%s/js/view/charts-viewer-service.js" % APP_NAME),
            static("%s/js/view/charts-viewer-directive.js" % APP_NAME),
        ],
        "css": [
            static("%s/css/view.css" % APP_NAME),
        ]
    },
}]