import React, {Component} from 'react';
import './css/app.css'
import Navigator from './components/Navigator.jsx';
import ResourceSelector from './components/ResourceSelector.jsx'
import BasicConfig from './components/BasicConfig.jsx'
import EditService from './services/editService.jsx'
import ChartsConfig from './components/ChartsConfig.jsx'
export default class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      config: {},
      selectedResource: this.props.config.instance ? this.props.config.instance.map:undefined
    }
    this.editService = new EditService({baseUrl: '/'});
  }

  goToStep(step) {
    this.setState({step});
  }
  render() {
    var {step} = this.state
    const steps = [
      {
        label: "Select Map",
        component: ResourceSelector,
        props: {
          resourcesUrl: this.props.config.urls.resources_url,
          instance: this.state.selectedResource,
          username:this.props.username,
          selectMap: (resource) => {
            this.setState({selectedResource: resource})
          },
          limit: this.props.config.limit,
          onComplete: () => {
            var {step} = this.state;
            this.setState({
              config: Object.assign(this.state.config, {map: this.state.selectedResource.id})
            })
            this.goToStep(++step)
          }
        }
      }, {
        label: "General & Tools",
        component: BasicConfig,
        props: {
          instance: this.state.selectedResource,
          config: this.props.config ? this.props.config.config : undefined,
          onComplete: (basicConfig) => {
            var {step} = this.state;

            this.setState({
              config: Object.assign(this.state.config, basicConfig)
            })
            this.goToStep(++step)
          }
        }
      },
      {
        label: "Charts Configrations",
        component: ChartsConfig,
        props: {
          resource:this.state.selectedResource,
          instance: this.props.config.instance ? this.props.config.instance.config.chartsViewer : undefined,
          id:this.props.config.instance ? this.props.config.instance.id:undefined,
          urls:this.props.config.urls,
          onComplete: (basicConfig) => {
            var {step} = this.state;

            this.setState({
              config: Object.assign(this.state.config.config, basicConfig)
            })
            this.editService.save(this.state.config,this.props.instance? this.props.config.instance.id : undefined).then((res)=>window.location.href="/apps/cartoview_charts_viewer/"+res.id+"/view")
          }
        }
      }

    ]
    return (
      <div className="wrapping">
        <Navigator steps={steps} step={step} onStepSelected={(step) => this.goToStep(step)}/>
        <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel">
          {steps.map((s, index) => index == step && <s.component key={index} {...s.props}/>)}
        </div>
      </div>
    )
  }
}
