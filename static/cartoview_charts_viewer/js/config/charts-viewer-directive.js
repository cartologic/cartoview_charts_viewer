/**
 * Created by kamal on 6/29/16.
 */
angular.module('cartoview.viewer.editor').directive('chartsViewerConfig', function (urlsHelper) {
    var numericTypes = ['xsd:byte',
        'xsd:decimal',
        'xsd:double',
        'xsd:int',
        'xsd:integer',
        'xsd:long',
        'xsd:negativeInteger',
        'xsd:nonNegativeInteger',
        'xsd:nonPositiveInteger',
        'xsd:positiveInteger',
        'xsd:short',
        'xsd:unsignedLong',
        'xsd:unsignedInt',
        'xsd:unsignedShort',
        'xsd:unsignedByte'
    ];
    return {
        transclude: true,
        replace: true,
        templateUrl: urlsHelper.static + "cartoview_charts_viewer/angular-templates/config-fields.html?" + new Date().getTime(),
        controller: function ($scope, dataService, $tastypieResource) {
            $scope.attributes = new $tastypieResource("geonodelayerattribute");
            $scope.instanceObj = dataService.instanceObj;
            $scope.instanceObj.config.chartsViewer = $scope.instanceObj.config.chartsViewer || {};
            var chartsViewer = $scope.instanceObj.config.chartsViewer;
            $scope.operations = [{
                name: 'Sum',
                title: 'Summation'
            },
                {
                    name: 'Average',
                    title: 'Average'
                },
                {
                    name: 'Count',
                    title: 'Count'
                },
                {
                    name: 'Min',
                    title: 'Minimum'
                },

                {
                    name: 'Max',
                    title: 'Maximum'
                },
                {
                    name: 'Median',
                    title: 'Median'
                },];
            $scope.chartTypes=[
              {
                name:'bar',
                title:'Bar Chart'
              },
              {
                name:'line',
                title:'Line Chart'
              },
              {
                name:'pie',
                title:'Pie Chart'
              },
              {
                name:'doughnut',
                title:'Doughnut Chart'
              },
              {
                name:'radar',
                title:'Radar Chart'
              },
              {
                name:'all',
                title:'View All Charts'
              },
            ]
            $scope.mapLayers = [];
            var layersDict = {};
            var initialized = false;
            var populateLayers = function () {
                $scope.mapLayers = [];
                if (dataService.selected.map) {
                    angular.forEach(dataService.selected.map.map_layers, function (layer) {
                        if (!layer.fixed) {
                            layer.params = JSON.parse(layer.layer_params);
                            layersDict[layer.name] = layer;
                            var layerInfo = {
                                name: layer.name,
                                title: layer.params.title
                            };
                            $scope.mapLayers.push(layerInfo);
                        }
                    });
                }

            };
            $scope.getLayerAttrs = function () {
                if (!chartsViewer.layer) return null;
                var layer;
                angular.forEach($scope.mapLayers, function (l) {
                    if (l.name == chartsViewer.layer) {
                        layer = l;
                        return false;
                    }
                });
                if (!layer) return null;
                if (!layer.attributes) {
                    layer.attributes = [];
                    $scope.attributes.objects.$find({layer__typename: layer.name}).then(function () {
                        angular.forEach($scope.attributes.page.objects, function (attr) {
                            if (attr.attribute_type && attr.attribute_type.indexOf("gml:") != 0) {
                                var attribute = {
                                    name: attr.attribute,
                                    title: attr.attribute_label || (attr.attribute + " "), //add space to fix angular bug when name and title is the same it isn't select the attribute in the drop down
                                    type: attr.attribute_type,
                                    isNumeric: numericTypes.indexOf(attr.attribute_type) != -1
                                };
                                layer.attributes.push(attribute);
                            }
                        });
                    });
                }
                return layer.attributes;
            };
            dataService.onMapSelect(function () {
                populateLayers();
            });
            populateLayers();
        }
    }
});
