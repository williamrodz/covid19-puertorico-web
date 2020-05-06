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

const App = (data,xAxisLabel="x",yAxisLabel="y",graphColors="blue") =>

  (
      <ResponsiveLine
          data={data}
          // animate={lineGraphSettings.animate == false ? lineGraphSettings.animate : true}
          theme={theme}
          enableArea={false}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
          axisTop={null}
          axisRight={null}
          axisBottom={window.innerWidth > 767 ? {
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: xAxisLabel,
              legendOffset: 40,
              legendPosition: 'middle',
          }: null}
          axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: yAxisLabel,
              legendOffset: -50,
              legendPosition: 'middle'
          }}
          lineWidth={4}
          colors={graphColors }
          enablePoints={false}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel={`${yAxisLabel}`}
          pointLabelYOffset={-12}
          useMesh={true}
          crosshairType="bottom"
          enableSlices='x'
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



export default App;
