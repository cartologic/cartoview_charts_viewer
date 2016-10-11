from django.templatetags.static import static

widgets = [{
    'title': 'Charts Viewer',
    'name': 'ChartsViewer',

    'config': {
        'directive': 'charts-viewer-config',
        'js': [
            static("charts_viewer/js/config/charts-viewer-directive.js"),
        ],
        "css": [
            static("charts_viewer/css/config.css"),
        ]
    },
    'view': {
        'directive': 'charts-viewer',
        'js': [
            static("charts_viewer/js/view/app.js"),
            static("charts_viewer/js/view/main-controller.js"),
            static("charts_viewer/js/view/charts-viewer-service.js"),
            static("charts_viewer/js/view/charts-viewer-directive.js"),
        ],
        "css": [
            static("charts_viewer/css/view.css"),
        ]
    },
}]