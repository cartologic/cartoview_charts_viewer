import React, {Component} from 'react';
import './css/app.css'
import Navigator from './components/Navigator.jsx';
import ResourceSelector from './components/ResourceSelector.jsx'
import About from './components/About.jsx';
import BasicConfig from './components/BasicConfig.jsx'
import EditService from './services/editService.jsx'
export default class Edit extends Component {
  constructor(props) {
    super(props)
    this.editService = new EditService({baseUrl: '/'});
  }
  state = {
    step: 0,
    config: {},
    selectedResource: undefined
  }
  goToStep(step) {
    this.setState({step});
  }
  render() {
    var {step} = this.state
    const steps = [
      {
        label: "About",
        component: About,
        props: {
          onComplete: () => {
            var {step} = this.state;
            this.goToStep(++step)
          },
          content: <p>
            {"Creating charts for numeric attributes of features in a specified layer that fall in the visible map extent. The Charts can be configured to show the sum, average, minimum and maximum of specified field values."}
          </p>,
          title: "Cartoview Charts Viewer"
        }
      }, {
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
          config: this.props.defaultconf,
          onComplete: (basicConfig) => {
            var {step} = this.state;

            this.setState({
              config: Object.assign(this.state.config, basicConfig)
            })
            this.goToStep(++step)
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
