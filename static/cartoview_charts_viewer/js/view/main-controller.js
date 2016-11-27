/**
 * Created by kamal on 7/2/16.
 */


angular.module('cartoview.chartsViewerApp').controller('cartoview.chartsViewerApp.MainController',
    function($scope, mapService, identifyService, $mdSidenav, $mdMedia, $mdDialog, appConfig){
        $scope.config = appConfig;
        $scope.toggleSidenav = function() {
            return $mdSidenav('left').toggle();
        };
        $scope.map = mapService.map;
        $scope.identify = identifyService;
});