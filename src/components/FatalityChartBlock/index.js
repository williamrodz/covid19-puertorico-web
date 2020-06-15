import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';


import {getPercent } from '../Common/index.js'


const FatalityRateChart = (props) =>{

  return (
    <div className="statsBlock" style={{borderStyle: 'solid',borderColor: "#cbd5e0",borderWidth: "1px",borderRadius: 15,display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
      <PieChart
        data={[
          { title: 'Casos positivos resultando en muertes', value: parseInt(props.deaths*100/props.confirmedCases), color: 'red' },
          { title: 'Casos positivos sobrevientes', value: 100-parseInt(props.deaths*100/props.confirmedCases), color: '#ffeaa7' }

        ]}
        totalValue={100}

        animate={true}
        lineWidth={30} // Adjusts "donut" width
        label={({ dataEntry }) => getPercent(props.deaths,props.confirmedCases,2)}
        labelStyle={{
          fontSize: '20px',
          fontFamily: 'sans-serif',
          fill: 'red',
        }}
        labelPosition={0}
        style={{height: "140px"}}


      />
      <text style={{textAlign:'center',fontSize: 20,fontWeight: 'bold',marginRight: "18px"}}>{props.description}</text>

    </div>
  )
}
export default FatalityRateChart
