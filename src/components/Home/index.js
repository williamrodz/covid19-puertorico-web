import React, {Component} from 'react';

import { FirebaseCondiv } from '../Firebase';


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

    console.log("PRops are")
    console.log(props)
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
      const historicalData = historicalDataRef.data().all
      this.setState({historicalData:historicalData})
    }
}

  render (){
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

      </div>
    );
  }

}
export default Home;
