import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';


import {getPercent } from '../Common/index.js'


const FatalityRateChart = (props) =>{

  return (
    <div className="statsBlock" style={{borderStyle: 'solid',borderColor: "#cbd5e0",borderWidth: "1px",borderRadius: 15,display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
      <div style={{textAlign:'center',fontSize: 20,marginRight: "18px",color: 'grey'}}>{props.description}</div>

      <PieChart
        data={[
          { title: 'Casos positivos resultando en muertes', value: parseInt(props.deaths*100/props.totalPositive), color: 'red' },
          { title: 'Casos positivos sobrevientes', value: 100-parseInt(props.deaths*100/props.totalPositive), color: '#ffeaa7' }

        ]}
        totalValue={100}

        animate={true}
        lineWidth={30} // Adjusts "donut" width
        label={({ dataEntry }) => props.totalPositive !== 0 ? getPercent(props.deaths,props.totalPositive,2) : null}
        labelStyle={{
          fontSize: '20px',
          fontFamily: 'sans-serif',
          fill: 'red',
        }}
        labelPosition={0}
        style={{height: "140px"}}


      />

    </div>
  )
}
export default FatalityRateChart
