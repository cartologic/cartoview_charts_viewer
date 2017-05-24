import React from 'react';
import {render} from 'react-dom';
import {Bar} from 'react-chartjs-2';
import {
  Row,
  Col
} from 'reactstrap';
export default class BarChart extends React.Component {
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
        <h6 className="text-center">as Bar Chart</h6>
        <Row>
          <Col style={{
            backgroundColor: 'white'
          }}>
            <Bar data={data} options={{
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ]
              },
              responsive: true,
              animationSteps: 100
            }}/>
          </Col>
        </Row>
      </div>
    )
  }
}
