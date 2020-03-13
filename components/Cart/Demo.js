/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { BarChart, Bar, Brush, CartesianGrid, ReferenceLine, XAxis, YAxis, Tooltip } from 'recharts';

export default class Demo extends Component {

  render() {

    const { zipcodes } = this.props;   

    return (
      <div className="bar-charts" >                      

        <p>BarChart of positive and negative values</p>
        <div className="bar-chart-wrapper" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
          <BarChart width={1100} height={250} barGap={2} barSize={6} data={zipcodes} margin={{ top: 20, right: 60, bottom: 0, left: 20 }}>
            <XAxis dataKey="state" />
            <YAxis tickCount={7} />
            <Tooltip />
            <CartesianGrid />
            <Bar dataKey="biggestCity.pop" fill="#ff7300" radius={[5, 5, 5, 5]} />
            <Bar dataKey="smallestCity.pop" fill="#387908" radius={[5, 5, 5, 5]} />
            <Brush dataKey="_id" height={30} />
            <ReferenceLine type="horizontal" value={0} stroke="#666" />
          </BarChart>
        </div>        

      </div>
    );
  }
}
