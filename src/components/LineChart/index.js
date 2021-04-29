import React from 'react';
import { ResponsiveLine } from '@nivo/line'


const theme = {
  axis: {
    legend:{
      text:{
        fontSize:20
      }
    }
  },
  grid: {
  },
  legends:{
    text:{
      fontSize: 14,
    }
  }
};



const App = (props) => {

  const toolTipElement = (tooltipProps) => {


      return (
        <div className="toolTipElement">
          <div style={{margin:5}}>
            <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
              <div style={{backgroundColor: tooltipProps.point.serieColor,borderRadius: '5px',height: '1.5vw',width: '1.5vw',margin: "5px"}}/>
              <div>{tooltipProps.point.serieId}:<span style={{fontWeight: 'bold'}}> {tooltipProps.point.data.y}</span></div>
            </div>
            <div style={{textAlign: 'right',display: 'flex',flexDirection: 'row-reverse'}}>
              <span style={{fontWeight: 'bold'}}><span style={{color:'white'}}>_</span>{tooltipProps.point.data.x}</span>
              <div><span>{props.xAxisLabel}:</span></div>

            </div>
          </div>
        </div>)
  };


  return (
      <ResponsiveLine
          data={props.data}
          // animate={lineGraphSettings.animate == false ? lineGraphSettings.animate : true}
          theme={theme}
          enableArea={false}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
          axisTop={null}
          axisRight={null}
          axisBottom={false ? {
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: props.xAxisLabel ? props.xAxisLabel : "x",
              legendOffset: 40,
              legendPosition: 'middle',
          }: null}
          axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: props.yAxisLabel ? props.yAxisLabel : "y",
              legendOffset: -50,
              legendPosition: 'middle'
          }}
          lineWidth={4}
          colors={props.graphColors ? props.graphColors : "blue" }
          enablePoints={false}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel={`${props.yAxisLabel ? props.yAxisLabel : "y"}`}
          pointLabelYOffset={-12}
          useMesh={true}
          crosshairType="bottom"
          // enableSlices={'x'}
          tooltip={toolTipElement}
          // legends={[
          //     {
          //         anchor: 'top-left',
          //         direction: 'column',
          //         justify: false,
          //         translateX: 0,
          //         translateY: 0,
          //         itemsSpacing: 0,
          //         itemDirection: 'left-to-right',
          //         itemWidth: 210,
          //         itemHeight: 20,
          //         itemOpacity: 0.75,
          //         symbolSize: 12,
          //         symbolShape: 'circle',
          //         symbolBorderColor: 'rgba(0, 0, 0, .5)',
          //         effects: [
          //             {
          //                 on: 'hover',
          //                 style: {
          //                     itemBackground: 'rgba(0, 0, 0, .03)',
          //                     itemOpacity: 1
          //                 }
          //             }
          //         ]
          //     }]}


      />
  )
}



export default App;
