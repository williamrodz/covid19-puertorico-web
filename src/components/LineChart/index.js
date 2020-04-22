import React from 'react';
import { ResponsiveLine } from '@nivo/line'


const lineGraphSettings = {
theme: {
fontSize: '16px',
textColor: 'blue',
},
};

const App = (data,xAxisLabel="x",yAxisLabel="y",graphColors="blue") =>

  (
      <ResponsiveLine
          data={data}
          // animate={lineGraphSettings.animate == false ? lineGraphSettings.animate : true}
          // theme={lineGraphSettings.theme}
          enableArea={false}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: xAxisLabel,
              legendOffset: 36,
              legendPosition: 'middle'
          }}
          axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: yAxisLabel,
              legendOffset: -40,
              legendPosition: 'middle'
          }}
          lineWidth={"4px"}
          colors={graphColors }
          enablePoints={false}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel={`${yAxisLabel}`}
          pointLabelYOffset={-12}
          useMesh={true}

      />
  )



export default App;
