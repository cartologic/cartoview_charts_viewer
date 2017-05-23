import React from 'react';
import {render} from 'react-dom';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import RadarChart from './RadarChart';
import WpsClient from './wps-client.jsx';
import Typist from 'react-typist';
import $ from "jquery";
import {
  Container,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
export default class CartoviewCharts extends React.Component {
  constructor(props) {
    super(props)
    this.wpsClient = new WpsClient({geoserverUrl: geoserver_url});
    this.state = {
      data: [],
      labels: [],
      colors: [],
      loading: true
    }
  }
  dynamicColor() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ",0.80)";
  }
  componentDidMount() {
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
      this.setState({data: values, labels: labels, colors: colors});
      $(".se-pre-con").fadeOut("slow");
    });
  }
  render() {
    let title = <h1 className="display-4 text-center">{appConfig.chartsViewer.chartTitle}</h1>
    let description = <Typist className="MyTypist" cursor={{
      show: true,
      blink: true,
      element: '|',
      hideWhenDone: true,
      hideWhenDoneDelay: 1000
    }}>
      {abstract}
    </Typist>;

    return (
      <div>
        <Navbar color="faded" toggleable>
          <NavbarBrand style={{
            marginLeft: 'auto',
            marginRight: 'auto'
          }} href="/">Cartoview</NavbarBrand>
        </Navbar>

        <Container style={{
          marginTop: 50,
          marginBottom: 50
        }}>
          {title}
          <br></br>
          <br></br>
          <br></br>
          <Row style={{
            paddingBottom: 50
          }}>
            {description}
          </Row>
          <BarChart data={this.state.data} labels={this.state.labels} label={appConfig.chartsViewer.attribute} colors={this.state.colors}></BarChart>
          <hr></hr>
          <LineChart data={this.state.data} labels={this.state.labels} label={appConfig.chartsViewer.attribute} colors={this.dynamicColor()}></LineChart>
          <hr></hr>
          <DoughnutChart data={this.state.data} labels={this.state.labels} colors={this.state.colors}></DoughnutChart>
          <hr></hr>
          <PieChart data={this.state.data} labels={this.state.labels} colors={this.state.colors}></PieChart>
          <hr></hr>
          <RadarChart data={this.state.data} labels={this.state.labels} label={appConfig.chartsViewer.attribute} colors={this.dynamicColor()}></RadarChart>
          <hr></hr>
        </Container>
      </div>
    )
  }
}
render(
  <CartoviewCharts></CartoviewCharts>, document.getElementById('root'))