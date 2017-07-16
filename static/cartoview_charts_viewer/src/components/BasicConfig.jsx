import React, {Component} from 'react';
import t from 'tcomb-form';
const mapConfig = t.struct({
  title: t.String,
  abstract: t.String,
  showZoombar: t.Boolean,
  showLayerSwitcher: t.Boolean,
  showBaseMapSwitcher: t.Boolean,
  showLegend: t.Boolean
});
const Form = t.form.Form;
export default class BasicConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultconf: {
        title: this.props.instance.title || "No Title Provided",
        abstract: this.props.instance.abstract || "No Abstract Provided",
        showZoombar: this.props.config
          ? this.props.config.showZoombar
          : true,
        showLayerSwitcher: this.props.config
          ? this.props.config.showLayerSwitcher
          : true,
        showBaseMapSwitcher: this.props.config
          ? this.props.config.showBaseMapSwitcher
          : true,
        showLegend: this.props.config
          ? this.props.config.showBaseMapSwitcher
          : true
      }
    }
  }
  componentDidMount() {}
  save() {
    var basicConfig = this.refs.form.getValue();
    if (basicConfig) {
      const properConfig = {
        title: basicConfig.title,
        abstract: basicConfig.abstract,
        config: {
          showZoombar: basicConfig.showZoombar,
          showLayerSwitcher: basicConfig.showLayerSwitcher,
          showBaseMapSwitcher: basicConfig.showBaseMapSwitcher,
          showLegend: basicConfig.showLegend
        }
      }
      this.props.onComplete(properConfig)
    }
  }
  render() {
    return (
      <div className="row">
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <h2>General & Tools</h2>
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <button className="btn btn-primary pull-right" onClick={this.save.bind(this)}>Next</button>
          </div>

        </div>
        <Form ref="form" value={this.state.defaultconf} type={mapConfig}/>
      </div>
    )
  }
}
