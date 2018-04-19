import 'openlayers/css/ol.css';
import './app.css';

import {
  Col,
  Collapse,
  Container,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Row
} from 'reactstrap';
import {findDOMNode, render} from 'react-dom';

import $ from "jquery";
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import PieChart from './PieChart';
import RadarChart from './RadarChart';
import React from 'react';
import Typist from 'react-typist';
import WpsClient from './wps-client.jsx';
import ol from 'openlayers'
export default class CartoviewCharts extends React.Component {
  constructor(props) {
    super(props)
    this.map = new ol.Map({
      //controls: [new ol.control.Attribution({collapsible: false}), new ol.control.ScaleLine()],
      layers: [new ol.layer.Tile({title: 'OpenStreetMap', source: new ol.source.OSM()})],
      view: new ol.View({
        center: [
          0, 0
        ],
        zoom: 3
      })
    });
    this.map.on('moveend', () => {

      if (!this.state.loading) {
        var extent = this.map.getView().calculateExtent(this.map.getSize());
        this.wpsClient.aggregateWithFilters({
          aggregationAttribute: appConfig.chartsViewer.attribute,
          aggregationFunction: appConfig.chartsViewer.operation,
          groupBy: {
            attributes: appConfig.chartsViewer.groupBy
          },
          filters: {
            minx: extent[0],
            miny: extent[1],
            maxx: extent[2],
            maxy: extent[3]
          },
          typeName: appConfig.chartsViewer.layer
        }).then((data) => {
          var labels = data.AggregationResults.map((item) => item[0]);
          var values = data.AggregationResults.map((item) => item[1]);
          var colors = data.AggregationResults.map((item) => this.dynamicColor());
          this.setState({data: values, labels: labels, colors: colors});
        }).catch((error) => {
          console.error(error);
        });
        // console.log(extent);
      }

    });
    this.wpsClient = new WpsClient({geoserverUrl: geoserver_url});
    this.state = {
      data: [],
      labels: [],
      colors: [],
      loading: true,
      config: {
        mapId: map_id
      },
      modal: false
    }
  }
  update(config) {
    if (config && config.mapId) {
      var url = mapUrl;
      fetch(url, {
        method: "GET",
        credentials: 'include'
      }).then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      }).then((config) => {
        if (config) {
          MapConfigService.load(MapConfigTransformService.transform(config), this.map,PROXY_URL);
        }
      }).catch((error) => {
        console.error(error);
      });

    }
  }
  componentWillMount() {
    this.update(this.state.config);
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  dynamicColor() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ",0.80)";
  }
  componentDidMount() {
    this.map.setTarget(findDOMNode(this.refs.map));
    this.wpsClient.aggregate({
      aggregationAttribute: appConfig.chartsViewer.attribute,
      aggregationFunction: appConfig.chartsViewer.operation,
      groupBy: {
        attributes: appConfig.chartsViewer.groupBy
      },
      typeName: appConfig.chartsViewer.layer
    }).then((data) => {
      var labels = data.AggregationResults.map((item) => item[0]);
      var values = data.AggregationResults.map((item) => item[1]);
      var colors = data.AggregationResults.map((item) => this.dynamicColor());
      this.setState({data: values, labels: labels, colors: colors, loading: false});
      $(".se-pre-con").fadeOut("slow");
    }).catch((error) => {
      console.error(error);
    });
    // $(".se-pre-con").fadeOut("slow");
  }
  render() {
    const charts = [
      {
        name: 'bar',
        element: <BarChart data={this.state.data} labels={this.state.labels} label={appConfig.chartsViewer.attribute} colors={this.state.colors}></BarChart>
      }, {
        name: 'line',
        element: <LineChart data={this.state.data} labels={this.state.labels} label={appConfig.chartsViewer.attribute} colors={this.dynamicColor()}></LineChart>
      }, {
        name: 'doughnut',
        element: <DoughnutChart data={this.state.data} labels={this.state.labels} colors={this.state.colors}></DoughnutChart>

      }, {
        name: 'pie',
        element: <PieChart data={this.state.data} labels={this.state.labels} colors={this.state.colors}></PieChart>
      }, {
        name: 'radar',
        element: <RadarChart data={this.state.data} labels={this.state.labels} colors={appConfig.chartsViewer.attribute}></RadarChart>
      }
    ];
    let chartElement = appConfig.chartsViewer.type != "all"
      ? charts.find(chart => chart.name == appConfig.chartsViewer.type).element
      : charts.map((chart) => chart.element);

    return (
      <div>
        <div className="page-header">
          <div className="row">
            <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
              <span className="h1">{title}</span>
            </div>
          </div>
        </div>

        <br></br>
        <Row>
          <div ref="map" className="map"></div>
        </Row>
        <hr></hr>
        {chartElement}
      </div>
    )
  }
}
render(
  <CartoviewCharts></CartoviewCharts>, document.getElementById('root'))
