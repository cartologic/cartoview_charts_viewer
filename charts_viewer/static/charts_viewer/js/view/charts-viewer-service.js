/**
 * Created by kamal on 7/3/16.
 */
angular.module('cartoview.chartsViewerApp').service('chartsViewerService', function(mapService, dataService, urlsHelper, $http, appConfig, $rootScope) {
    var service = this;
    service.appConfig = appConfig;
    service.chartsViewer = appConfig.chartsViewer;
    service.loading = 1;

    var olMap = mapService.map.olMap;

    olMap.on('moveend', function(event){
      var layer = service.chartsViewer.layer;
      var view = olMap.getView();
      var extent = view.calculateExtent(olMap.getSize());
      var projection = view.getProjection();
      var url = urlsHelper.cartoviewGeoserverProxy + "wfs";

      dataService.getData(url, layer, extent, projection).success( function(data) {
        service.chartsViewer.chart = dataService.processData(data);
      }).error(function(){
        console.error('Unable to load extent data from the server...');
      });

    });
});

angular.module('cartoview.chartsViewerApp').service('dataService', function($http, appConfig){

  this.getData = function(url, layer, extent, projection) {

    return $http({
      method: 'GET',
         url: url,
      params: {
        service : 'WFS',
        version : '1.1.0',
        request : 'GetFeature',
        typename: layer,
        bbox: extent.join(',') + ',' + projection.getCode(),
        maxFeatures: 5000,
        outputFormat: 'application/json'
      }
    });

  }

  this.processData = function(data) {

    console.log(appConfig);

    var chartTitle = appConfig.chartsViewer.chartTitle;
    var vAxisAttribute = appConfig.chartsViewer.vAxisAttribute;
    var hAxisAttribute = appConfig.chartsViewer.hAxisAttribute;
    var vAxisTitle = appConfig.chartsViewer.vAxisTitle;
    var hAxisTitle = appConfig.chartsViewer.hAxisTitle;
    var vAxisOperation = appConfig.chartsViewer.vAxisOperation;

    var group = {};
    var countData = [];
    var avgData = [];
    var minData = [];
    var maxData = [];

    // group features based on group attribute
    angular.forEach(data.features, function(f,index) {

      var date = new Date(f.properties[hAxisAttribute]);
      var year = date.getFullYear();

      group[year] = group[year] || {count: 0, sum: 0, min: 0, max: 0, avg: 0};
      group[year].count++;
      group[year].sum += f.properties[vAxisAttribute];

      if (f.properties[vAxisAttribute] > 0){
        if (group[year].min == 0) {
           group[year].min = f.properties[vAxisAttribute];
        }
        if (f.properties[vAxisAttribute] < group[year].min) {
          group[year].min = f.properties[vAxisAttribute];
        }

        if (f.properties[vAxisAttribute] > group[year].max) {
          group[year].max = f.properties[vAxisAttribute];
        }
      }

    });

    angular.forEach(group, function(item, key) {
      item.avg = item.sum / item.count;

      countData.push({c: [
        {v: key.toString()},
        {v: item.count}
      ]});

      avgData.push({c: [
        {v: key.toString()},
        {v: item.avg}
      ]});

      minData.push({c: [
        {v: key.toString()},
        {v: item.min}
      ]});

      maxData.push({c: [
        {v: key.toString()},
        {v: item.max}
      ]});

    });


    var width = 550;
    var height = 210;

    // Chart Configuration
    var dataChart = {};
    var rows = {};

    if (vAxisOperation == "count") {
      rows = countData;
    }
    else if (vAxisOperation == "min") {
      rows = minData;
    }
    else if (vAxisOperation == "max") {
      rows = maxData;
    }
    else if (vAxisOperation == "avg") {
      rows = avgData;
    }

    dataChart.type = "ColumnChart";
    dataChart.data = {
      "cols": [
        {id: "y", label: hAxisTitle, type: "string"},
        {id: "e", label: vAxisTitle, type: "number"}
      ],
      "rows": rows};

    dataChart.options = {
      width: width,
      height: height,
      title: chartTitle,
      bar: {'groupWidth': '85%'},
      chartArea:{
        left: 70,
        top: 40,
        width: width,
        height: height - 80,
      },
      vAxis: {title: vAxisTitle,  gridlines: { count: 4 }},
      hAxis: {title: hAxisTitle}
    };

    return dataChart;
  }

});
