import React from 'react';
import {render} from 'react-dom';
import {Line, Doughnut, Bar} from 'react-chartjs-2';
import {WpsClient} from './wps-client'
import './app.css'
export default class CartoviewCharts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        labels: [
          "Red",
          "Blue",
          "Yellow",
          "Green",
          "Purple",
          "Orange"
        ],
        datasets: [
          {
            label: '# of Votes',
            data: [
              12,
              19,
              3,
              5,
              2,
              3
            ],
            backgroundColor: 'rgba(0, 255, 187, 1)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1
          }
        ]
      },
      loading: true
    }
  }
  render() {

    return (
      <div style={{
        height: 500,
        width: 500
      }}>
        <Bar data={this.state.data} options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }} height={100} width={100}/>
      </div>
    )
  }
}
render(
  <CartoviewCharts></CartoviewCharts>, document.getElementById('test'))
