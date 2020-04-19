import React, {Component} from 'react';

import { ResponsiveLine } from '@nivo/line'

const BLOCK_WIDTH = 100
const BLOCK_HEIGHT = 60
const DATA_VALUE_BACKGROUND_COLOR = "#ecf0f1"
const DATA_VALUE_TEXT_COLOR = "white"
const DATA_LABEL_BACKGROUND_COLOR = "#8e44ad"
const BACKGROUND_COLOR = "#bdc3c7"

const LABEL_FONT_SIZE = 18.5
const DATA_FONT_SIZE = 24

function getPercent(amount,total,decimals){
  var quotient = amount / total * 100
  return quotient.toFixed(decimals) + '%'

}


function getDataBlock(blockType,text,borderTopLeftRadius=0,borderTopRightRadius=0,borderBottomLeftRadius=0,borderBottomRightRadius=0){
  if (blockType == "label"){
    var backgroundColor = DATA_LABEL_BACKGROUND_COLOR
    var fontSize = LABEL_FONT_SIZE
    var fontColor = DATA_VALUE_TEXT_COLOR
  }
  else if (blockType == "data"){
    var backgroundColor = DATA_VALUE_BACKGROUND_COLOR
    var fontSize = DATA_FONT_SIZE
    var fontColor = "black"
  }
  return (
    <div style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT,
      borderTopLeftRadius: borderTopLeftRadius,borderTopRightRadius:borderTopRightRadius,borderBottomLeftRadius: borderBottomLeftRadius,borderBottomRightRadius:borderBottomRightRadius,
      backgroundColor: backgroundColor,
      alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign: 'center',fontSize:fontSize,color: fontColor}}>{text}</div>
    </div>
  )
}

class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
            conductedTests:0,
            confirmedCases:0,
            deaths:0,
            negativeCases:0,
            testsInProgress:0,
            timestamp:0,
            saludTimeSignature:0}

  }

  getLineChart = () =>{

    const data = [
  {
    "id": "japan",
    "color": "hsl(82, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 250
      },
      {
        "x": "helicopter",
        "y": 255
      },
      {
        "x": "boat",
        "y": 48
      },
      {
        "x": "train",
        "y": 212
      },
      {
        "x": "subway",
        "y": 39
      },
      {
        "x": "bus",
        "y": 251
      },
      {
        "x": "car",
        "y": 72
      },
      {
        "x": "moto",
        "y": 64
      },
      {
        "x": "bicycle",
        "y": 226
      },
      {
        "x": "horse",
        "y": 211
      },
      {
        "x": "skateboard",
        "y": 119
      },
      {
        "x": "others",
        "y": 276
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(269, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 132
      },
      {
        "x": "helicopter",
        "y": 189
      },
      {
        "x": "boat",
        "y": 224
      },
      {
        "x": "train",
        "y": 126
      },
      {
        "x": "subway",
        "y": 186
      },
      {
        "x": "bus",
        "y": 176
      },
      {
        "x": "car",
        "y": 115
      },
      {
        "x": "moto",
        "y": 136
      },
      {
        "x": "bicycle",
        "y": 94
      },
      {
        "x": "horse",
        "y": 285
      },
      {
        "x": "skateboard",
        "y": 125
      },
      {
        "x": "others",
        "y": 9
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(228, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 282
      },
      {
        "x": "helicopter",
        "y": 59
      },
      {
        "x": "boat",
        "y": 74
      },
      {
        "x": "train",
        "y": 189
      },
      {
        "x": "subway",
        "y": 171
      },
      {
        "x": "bus",
        "y": 178
      },
      {
        "x": "car",
        "y": 277
      },
      {
        "x": "moto",
        "y": 292
      },
      {
        "x": "bicycle",
        "y": 15
      },
      {
        "x": "horse",
        "y": 81
      },
      {
        "x": "skateboard",
        "y": 16
      },
      {
        "x": "others",
        "y": 1
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(339, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 240
      },
      {
        "x": "helicopter",
        "y": 56
      },
      {
        "x": "boat",
        "y": 128
      },
      {
        "x": "train",
        "y": 2
      },
      {
        "x": "subway",
        "y": 100
      },
      {
        "x": "bus",
        "y": 56
      },
      {
        "x": "car",
        "y": 294
      },
      {
        "x": "moto",
        "y": 89
      },
      {
        "x": "bicycle",
        "y": 273
      },
      {
        "x": "horse",
        "y": 140
      },
      {
        "x": "skateboard",
        "y": 89
      },
      {
        "x": "others",
        "y": 249
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(256, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 239
      },
      {
        "x": "helicopter",
        "y": 44
      },
      {
        "x": "boat",
        "y": 118
      },
      {
        "x": "train",
        "y": 72
      },
      {
        "x": "subway",
        "y": 217
      },
      {
        "x": "bus",
        "y": 61
      },
      {
        "x": "car",
        "y": 215
      },
      {
        "x": "moto",
        "y": 130
      },
      {
        "x": "bicycle",
        "y": 41
      },
      {
        "x": "horse",
        "y": 72
      },
      {
        "x": "skateboard",
        "y": 289
      },
      {
        "x": "others",
        "y": 65
      }
    ]
  }
]
    console.log(`Line data is ${data}`)
    const MyResponsiveLine = (
        <ResponsiveLine
            data={data}
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
                legend: 'transportation',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'count',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            colors={{ scheme: 'nivo' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    )
    return (
      <div style={{height:500,width:600}}>
        {MyResponsiveLine}
      </div>
    )
  }

  async componentDidMount(){
    var todaysData = await this.props.firebase.getTodaysData()
    if (todaysData.exists){
        var data = todaysData.data()
        this.setState({
        conductedTests:data.conductedTests,
        confirmedCases:data.confirmedCases,
        deaths:data.deaths,
        negativeCases:data.negativeCases,
        testsInProgress:data.testsInProgress,
        timestamp:data.timestamp,
        saludTimeSignature:data.saludTimeSignature,
      })
    } else{
      console.log("Data for today does not exist")
    }
    const historicalDataRef = await this.props.firebase.getHistoricalData()
    if (historicalDataRef.exists){
      console.log("Getting historicalData")
      const historicalData = historicalDataRef.data().all
      this.setState({historicalData:historicalData})

    }
}

  render (){
    console.log(this.state.historicalData)
    return (
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
        <div style={{display:'flex',flexDirection:'row',paddingTop: 2}}>
          <div style={{fontSize: 30,fontWeight: 'bold',divAlign:'center'}}>{"COVID-19 en\n Puerto Rico🇵🇷"}</div>
        </div>
        <div style={{display:'flex',flexDirection:'row',paddingTop: 5}}>
          {getDataBlock("label","Casos positivos",15)}
          {getDataBlock("label","Casos negativos")}
          {getDataBlock("label","Muertes",0,15)}
        </div>
        <div style={{display:'flex',flexDirection:'row'}}>
          {getDataBlock("data",this.state.confirmedCases,0,0,15)}
          {getDataBlock("data",this.state.negativeCases)}
          {getDataBlock("data",this.state.deaths,0,0,0,15)}
        </div>

        <div style={{display:'flex',flexDirection:'row',paddingTop: 10}}>
          {getDataBlock("label","Porciento Positivo",15)}
          {getDataBlock("label","Porciento Negativo")}
          {getDataBlock("label","Porciento de muertes",0,15)}
        </div>
        <div style={{display:'flex',flexDirection:'row'}}>
          {getDataBlock("data",getPercent(this.state.confirmedCases,this.state.conductedTests,1),0,0,15)}
          {getDataBlock("data",getPercent(this.state.negativeCases,this.state.conductedTests,1))}
          {getDataBlock("data",getPercent(this.state.deaths,this.state.conductedTests,3),0,0,0,15)}
        </div>

        <div style={{display:'flex',flexDirection:'row',paddingTop: 10}}>
          {getDataBlock("label","Pruebas en proceso",15)}
          {getDataBlock("label","Pruebas realizadas",0,15)}
        </div>

        <div style={{display:'flex',flexDirection:'row'}}>
          {getDataBlock("data",this.state.testsInProgress,0,0,15)}
          {getDataBlock("data",this.state.conductedTests,0,0,0,15)}
        </div>
        {this.getLineChart()}

      </div>
    );
  }

}
export default Home;
