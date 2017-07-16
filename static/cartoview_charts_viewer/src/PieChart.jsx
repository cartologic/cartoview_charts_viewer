import React from 'react';
import {render} from 'react-dom';
import {Pie} from 'react-chartjs-2';
import {
  Row,
  Col
} from 'reactstrap';
export default class PieChart extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let data = {
      labels: this.props.labels,
      datasets: [
        {
          data: this.props.data,
          backgroundColor:this.props.colors,
          borderColor: 'rgba(0, 0, 0, 0.75)',
          borderWidth: 1
        }
      ]
    }
    return (
      <div>
        <Row>
          <Col style={{
            backgroundColor: 'white'
          }}>
            <Pie data={data} options={{
              responsive: true,
              animationSteps: 100
            }}/>
          </Col>
        </Row>
      </div>
    )
  }
}
