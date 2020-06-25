import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';


const TestDistributionChart = (props) =>{

  return (
        <div className="statsBlock" style={{borderColor:"#cbd5e0", borderStyle: 'solid',borderWidth: "1px",borderRadius: 15,display: 'flex',flexDirection: 'column',alignItems: 'center', minWidth: "410px"}}>
          <text style={{textAlign:'center',fontSize: 20,color:'grey',marginRight: "18px"}}>{props.description}</text>

          <PieChart
            startAngle={-90}
            data={[
              { title: props.confirmed, value:45, color: '#686de0' },
              { title: props.probable, value:55 , color: '#c7ecee' },

            ]}
            totalValue={100}

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

        </div>
  )
}

export default TestDistributionChart
