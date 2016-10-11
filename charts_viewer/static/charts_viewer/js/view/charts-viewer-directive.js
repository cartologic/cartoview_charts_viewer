/**
 * Created by kamal on 6/29/16.
 */
angular.module('cartoview.chartsViewerApp').directive('chartsViewer',  function(urlsHelper) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: urlsHelper.static + "charts_viewer/angular-templates/charts-viewer.html",
        controller: function ($scope, chartsViewerService) {
            $scope.service = chartsViewerService;
            $scope.collaped = false;
        }
    }
});
