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
          type: this.props.instance ? this.props.instance.type :"",
          chartTitle: this.props.instance ? this.props.instance.chartTitle : "",
          layer: this.props.instance ? this.props.instance.layer : "",
          attribute: this.props.instance ? this.props.instance.attribute : "",
          operation: this.props.instance ? this.props.instance.operation : "",
          groupBy: this.props.instance ? this.props.instance.groupBy : ""
        }
      },
      loading:false
    }
  }
  loadLayers() {
    fetch(this.props.urls.mapLayers +
      "?id=" + this.props.resource.id).then((response) => response.json()).then((data) => {
      this.setState({layers: data.objects})
    }).catch((error) => {
      console.error(error);
    });
  }
  loadAttributes() {
    let typename = this.refs.layer.value
    this.setState({loading:true})
    if (typename != "") {
      fetch(this.props.urls.layerAttributes +
        "?layer__typename=" + typename).then((response) => response.json()).then((data) => {
        this.setState({attributes: data.objects,loading:false})
      }).catch((error) => {
        console.error(error);
      });
    }
  }
  componentDidMount() {
    this.loadLayers()
  }
  save(event) {
    event.preventDefault();
    let config = {
      chartsViewer: {
        type: this.refs.chartType.value,
        chartTitle: this.refs.title.value,
        layer: this.refs.layer.value,
        attribute: this.refs.attribute.value,
        operation: this.refs.operation.value,
        groupBy: this.refs.groupBy.value
      }
    }
    this.props.onComplete(config)
  }
  render() {
    return (
      <div className="row">
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <h2>Charts Configurations</h2>
          </div>

        </div>
        <form onSubmit={this.save.bind(this)}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Chart Title</label>
            <input type="text" defaultValue={this.state.config.chartsViewer.chartTitle} className="form-control" ref="title" placeholder="title" required/>
          </div>
          <div className="form-group">
            <label>Choose Chart Type</label>
            <select className="form-control" defaultValue={this.state.config.chartsViewer.type} ref="chartType" required>
              <option value={""}>Choose Type</option>
              {chartTypes.map((chart) => {
                return <option key={chart.name} value={chart.name}>
                  {chart.title}
                </option>
              })}
            </select>

          </div>
          <div className="form-group">
            <label>Choose Layer</label>
            <select className="form-control" ref="layer" defaultValue={this.state.config.chartsViewer.layer} onChange={this.loadAttributes.bind(this)} required>
              <option value={""}>Choose Layer</option>
              {this.state.layers && this.state.layers.map((layer, i) => {

                return <option key={layer.id} value={layer.typename}>
                  {layer.title}
                </option>
              })}

            </select>
          </div>
          <div className="form-group">
            <label>Choose Atrribute</label>
            <select className="form-control" defaultValue={this.state.config.chartsViewer.attribute} ref="attribute" required>
              <option value={""}>Choose Attribute</option>
              {this.state.layers && this.state.attributes && this.state.attributes.map((attribute) => {
                let type = attribute.attribute_type;
                if (numericTypes.indexOf(type) != -1 && type.indexOf("gml:") == -1) {
                  return <option key={attribute.id} value={attribute.attribute}>
                    {attribute.attribute || attribute.attribute_label}
                  </option>
                }
              })}

            </select>
            {!this.state.loading && this.state.layers>0 && this.state.attributes.length ==0 && <button type="button" className="btn btn-info" data-toggle="modal" data-target="#numericTypes">!</button>}
            {this.state.loading && <Spinner name="line-scale-pulse-out" color="steelblue"/>}
          </div>
          <div className="form-group">
            <label>Choose Operation</label>
            <select className="form-control" defaultValue={this.state.config.chartsViewer.operation} ref="operation" required>
              {this.state.layers && this.state.attributes && Object.keys(operations).map((key) => {
                return <option key={key} value={key}>
                  {operations[key]}
                </option>
              })}
            </select>

          </div>
          <div className="form-group">
            <label>Group By</label>
            <select className="form-control" defaultValue={this.state.config.chartsViewer.groupBy} ref="groupBy" required>
              <option value={""}>Choose Attribute</option>
              {this.state.layers && this.state.attributes && this.state.attributes.map((attribute) => {
                return <option key={attribute.id} value={attribute.attribute}>
                  {attribute.attribute || attribute.attribute_label}
                </option>
              })}

            </select>

            {this.state.loading && <Spinner name="line-scale-pulse-out" color="steelblue"/>}
          </div>
          <input type="submit" className="btn btn-primary" value="Submit"/>
          {this.props.id&&<a className="btn btn-primary" href={this.props.urls.view}>View</a>}
        </form>
      </div>
    )
  }
}
