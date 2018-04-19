import React, {Component} from 'react';
import Spinner from 'react-spinkit'
const operations = {
  Sum: 'Summation',
  Average: 'Average',
  Count: 'Count',
  Min: 'Minimum',
  Max: 'Maximum',
  Median: 'Median'
}
const numericTypes = [
  'xsd:byte',
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

const chartTypes = [
  {
    name: 'bar',
    title: 'Bar Chart'
  }, {
    name: 'line',
    title: 'Line Chart'
  }, {
    name: 'pie',
    title: 'Pie Chart'
  }, {
    name: 'doughnut',
    title: 'Doughnut Chart'
  }, {
    name: 'radar',
    title: 'Radar Chart'
  }, {
    name: 'all',
    title: 'View All Charts'
  }
]
export default class BasicConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      layers: [],
      attributes: [],
      config: {
        chartsViewer: {
          type: this.props.instance
            ? this.props.instance.type
            : "",
          chartTitle: this.props.instance
            ? this.props.instance.chartTitle
            : "",
          layer: this.props.instance
            ? this.props.instance.layer
            : "",
          attribute: this.props.instance
            ? this.props.instance.attribute
            : "",
          operation: this.props.instance
            ? this.props.instance.operation
            : "",
          groupBy: this.props.instance
            ? this.props.instance.groupBy
            : ""
        }
      },
      loading: false
    }
  }

  loadLayers() {
    fetch(this.props.urls.mapLayers + "?id=" + this.props.resource.id).then((response) => response.json()).then((data) => {
      this.setState({layers: data.objects})
    }).catch((error) => {
      console.error(error);
    });
  }

  loadAttributes(_typename) {
    let typename = typeof _typename == 'string'
      ? _typename
      : this.refs.layer.value != ''
        ? this.refs.layer.value
        : () => {
          this.setState({attributes: []})
          return null
        }
        this.setState({loading: true})
    if (typename != "") {
      fetch(this.props.urls.layerAttributes + "?layer__typename=" + typename).then((response) => response.json()).then((data) => {
        this.setState({attributes: data.objects, loading: false})
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  componentDidMount() {
    this.loadLayers()
    if (this.props.instance) {
      this.loadAttributes(this.props.instance.layer);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({success: nextProps.success})
  }
  handleSubmit() {
    this.refs.submitButton.click()
  }
  save(e) {
    e.preventDefault();
    let config = {
      chartsViewer: {
        type: this.refs.chartType.value,
        // chartTitle: this.refs.title.value,
        layer: this.refs.layer.value,
        attribute: this.refs.attribute.value,
        operation: this.refs.operation.value,
        groupBy: this.refs.groupBy.value
      }
    }
    console.log(config);
    this.props.onComplete(config)
  }
  render() {
    return (
      <div className="row">
        <div className="row">
          <div className="col-xs-5 col-md-4"></div>
          <div className="col-xs-7 col-md-8">
            <button style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className="btn btn-primary btn-sm pull-right disabled" onClick={this.save.bind(this)}>{"next >>"}</button>

            <button style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className="btn btn-primary btn-sm pull-right" onClick={() => this.props.onPrevious()}>{"<< Previous"}</button>
          </div>
        </div>
        <div className="row" style={{
          marginTop: "3%"
        }}>
          <div className="col-xs-5 col-md-4">
            <h4>{'Charts Configurations '}</h4>
          </div>
          <div className="col-xs-7 col-md-8">
            <a style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className={this.state.success === true
              ? "btn btn-primary btn-sm pull-right"
              : "btn btn-primary btn-sm pull-right disabled"} href={`/apps/charts_viewer/${this.props.id}/view/`}>
              View
            </a>

            <a style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className={this.state.success === true
              ? "btn btn-primary btn-sm pull-right"
              : "btn btn-primary btn-sm pull-right disabled"} href={`/apps/appinstance/${this.props.id}/`} target={"_blank"}>
              Details
            </a>

            <button style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className={this.state.success === true
              ? "btn btn-primary btn-sm pull-right disabled"
              : "btn btn-primary btn-sm pull-right"} onClick={this.handleSubmit.bind(this)}>Save</button>

            <p style={this.state.success == true
              ? {
                display: "inline-block",
                margin: "0px 3px 0px 3px",
                float: "right"
              }
              : {
                display: "none",
                margin: "0px 3px 0px 3px",
                float: "right"
              }}>App instance successfully saved!</p>
          </div>
        </div>
        <hr></hr>

        <form ref="form" onSubmit={this.save.bind(this)}>
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <div className="form-group">
                <label>Chart Type</label>
                <select className="form-control" defaultValue={this.state.config.chartsViewer.type} ref="chartType" required>
                  <option value={""}>Select Type</option>
                  {chartTypes.map((chart) => {
                    return <option key={chart.name} value={chart.name}>
                      {chart.title}
                    </option>
                  })}
                </select>
              </div>
            </div>
            <div className="col-xs-12 col-md-12">
              <div className="form-group">
                <label>Layer</label>
                <select className="form-control" ref="layer" value={this.state.config.chartsViewer.layer} onChange={(e) => {
                  let config = this.state.config;
                  config.chartsViewer.layer = e.target.value;
                  this.setState({
                    config: config
                  }, () => {
                    this.loadAttributes()
                  })
                }} required>
                  <option value={""}>Select Layer</option>
                  {this.state.layers && this.state.layers.map((layer, i) => {
                    return <option key={layer.id} value={layer.typename}>
                      {layer.title}
                    </option>
                  })}
                </select>
              </div>
            </div>
            <div className="col-xs-12 col-md-4">
              <div className="form-group">
                <label>Atrribute</label>
                <select className="form-control" value={this.state.config.chartsViewer.attribute} onChange={(e) => {
                  let config = this.state.config;
                  config.chartsViewer.attribute = e.target.value;
                  this.setState({config: config})
                }} ref="attribute" required>
                  <option value={""}>Select Attribute</option>

                  {this.state.layers && this.state.attributes && this.state.attributes.map((attribute) => {
                    let type = attribute.attribute_type;
                    if (numericTypes.indexOf(type) != -1 && type.indexOf("gml:") == -1) {
                      return <option key={attribute.id} value={attribute.attribute}>
                        {attribute.attribute || attribute.attribute_label}
                      </option>
                    }
                  })}

                </select>
                {!this.state.loading && this.state.layers > 0 && this.state.attributes.length == 0 && <button type="button" className="btn btn-info" data-toggle="modal" data-target="#numericTypes">!</button>}
                {this.state.loading && <Spinner name="line-scale-pulse-out" color="steelblue"/>}
              </div>
            </div>
            <div className="col-xs-12 col-md-4">
              <div className="form-group">
                <label>Operation</label>
                <select className="form-control" value={this.state.config.chartsViewer.operation} onChange={(e) => {
                  let config = this.state.config;
                  config.chartsViewer.operation = e.target.value;
                  this.setState({config: config})
                }} ref="operation" required>
                  {this.state.layers && this.state.attributes && Object.keys(operations).map((key) => {
                    return <option key={key} value={key}>
                      {operations[key]}
                    </option>
                  })}
                </select>
              </div>
            </div>
            <div className="col-xs-12 col-md-4">
              <div className="form-group">
                <label>Group By</label>
                <select className="form-control" value={this.state.config.chartsViewer.groupBy} onChange={(e) => {
                  let config = this.state.config;
                  config.chartsViewer.groupBy = e.target.value;
                  this.setState({config: config})
                }} ref="groupBy" required>
                  <option value={""}>Select Attribute</option>
                  {this.state.layers && this.state.attributes && this.state.attributes.map((attribute) => {
                    return <option key={attribute.id} value={attribute.attribute}>
                      {attribute.attribute || attribute.attribute_label}
                    </option>
                  })}
                </select>

                {this.state.loading && <Spinner name="line-scale-pulse-out" color="steelblue"/>}
              </div>
            </div>

            <input ref="submitButton" type="submit" className="btn btn-primary" value="Submit" style={{
              display: "none"
            }}/>
          </div>
        </form>
      </div>
    )
  }
}
