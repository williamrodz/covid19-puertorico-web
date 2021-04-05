import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';


const TestDistributionChart = (props) =>{


  return (
        <div className="statsBlock" style={{borderColor:"#cbd5e0", borderStyle: 'solid',borderWidth: "1px",borderRadius: 15,display: 'flex',flexDirection: 'column',alignItems: 'center', minWidth: "410px"}}>
          <div style={{textAlign:'center',fontSize: 20,color:'grey',marginRight: "18px"}}>{props.description}</div>

          <PieChart
            startAngle={-90}
            data={[
              { title: "PCR", value:props.molecularPositive, color: '#686de0' },
              { title: "Antibody", value:props.serologicalPositive , color: '#fab1a0' },
              { title: "Antigen", value:props.antigenPositive , color: 'yellow' },

            ]}
            totalValue={props.totalPositive}

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
