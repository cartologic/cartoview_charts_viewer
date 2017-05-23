import React from 'react';
import {render} from 'react-dom';
import {Line} from 'react-chartjs-2';
import {
  Row,
  Col
} from 'reactstrap';
export default class LineChart extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let data = {
      labels: this.props.labels,
      datasets: [
        {
          label: this.props.label,
          data: this.props.data,
          backgroundColor:this.props.colors,
          borderColor: 'rgba(0, 0, 0, 0.75)',
          borderWidth: 1
        }
      ]
    }
    return (
      <div>
        <h6 className="text-center">as Line Chart</h6>
        <Row>
          <Col style={{
            backgroundColor: 'white'
          }}>
            <Line data={data} options={{
              responsive: true,
              animationSteps: 100
            }}/>
          </Col>
        </Row>
      </div>
    )
  }
}
