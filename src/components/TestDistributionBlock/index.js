import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';


const TestDistributionChart = (props) =>{

  return (
        <div className="statsBlock" style={{borderColor:"#cbd5e0", borderStyle: 'solid',borderWidth: "1px",borderRadius: 15,display: 'flex',flexDirection: 'row',alignItems: 'center', minWidth: "410px"}}>
          <PieChart
            startAngle={-90}
            data={[
              { title: props.confirmed, value:props.confirmedCases, color: '#686de0' },
              { title: props.probable, value:props.probableCases , color: '#c7ecee' },

            ]}
            totalValue={props.confirmedCases+props.probableCases}

            animate={true}
            lineWidth={30} // Adjusts "donut" width
            label={({ dataEntry }) => `${dataEntry.title}`}
            labelStyle={(index) => ({
                    fill: "black",
                    fontSize: '10px',
                    fontFamily: 'sans-serif',
                    whiteSpace: "pre-line",
                  })}
            labelPosition={112} // 112= outer
            style={{height: "140px"}}

          />
          <text style={{textAlign:'center',fontSize: 20,fontWeight: 'bold',marginRight: "18px"}}>{props.description}</text>

        </div>
  )
}

export default TestDistributionChart
