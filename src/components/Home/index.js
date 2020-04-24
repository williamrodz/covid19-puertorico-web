import React, {Component} from 'react';
import { Button} from 'react-bootstrap';
import LineChart from '../LineChart';

const BLOCK_WIDTH = "10vw"
const LABEL_BLOCK_HEIGHT = 60
const DATA_BLOCK_HEIGHT = 40
const DATA_VALUE_BACKGROUND_COLOR = "#ecf0f1"
const DATA_VALUE_TEXT_COLOR = "white"
const DATA_LABEL_BACKGROUND_COLOR = "#3498db"
const BACKGROUND_COLOR = "#bdc3c7"

const LABEL_FONT_SIZE = 18.5
const DATA_FONT_SIZE = 24

const MONTHS_ES = {1:"enero",2:"febrero",3:"marzo",4:"abril",5:"mayo",6:"junio",7:"julio",8:"agosto",9:"septiembre",10:"octubre",11:"noviembre",12:"diciembre"}

const ATTRIBUTES = ["conductedTests","confirmedCases","negativeCases",'testsInProgress',"deaths"]
const ATTRIBUTE_CLASS_ORDER= ['primary','warning','success','secondary','danger']


const BOOTSTRAP_BUTTON_CLASSES_TO_COLORS = {'warning':'rgb(255, 193, 7)','primary':'rgb(0, 123, 255)','success':'rgb(40, 167, 69)','secondary':'rgb(108, 117, 125)','danger':'rgb(220, 53, 69)',}

// const ATTRIBUTES_TO_CLASSES =
var ATTRIBUTES_TO_CLASSES = []
ATTRIBUTES.forEach((item, i) => {
  ATTRIBUTES_TO_CLASSES[item] = ATTRIBUTE_CLASS_ORDER[i]
});

const DELTA_LINE_COLOR = 'purple'

const attributeToChartOptions = {
  'confirmedCases':{
    xKey: 'timestamp',
    yKey: 'confirmedCases',
    xAxisLabel: 'Fecha',
    yAxisLabel: 'Casos confirmados'
  },
  'conductedTests':{
    xKey: 'timestamp',
    yKey: 'conductedTests',
    xAxisLabel: 'Fecha',
    yAxisLabel: 'Pruebas administradas'
  },
  'negativeCases':{
    xKey: 'timestamp',
    yKey: 'negativeCases',
    xAxisLabel: 'Fecha',
    yAxisLabel: 'Casos negativos'
  },
  'testsInProgress':{
    xKey: 'timestamp',
    yKey: 'testsInProgress',
    xAxisLabel: 'Fecha',
    yAxisLabel: 'Pruebas en progreso'
  },
  'deaths':{
    xKey: 'timestamp',
    yKey: 'deaths',
    xAxisLabel: 'Fecha',
    yAxisLabel: 'Muertes'
  },

}


function getPercent(amount,total,decimals){
  var quotient = amount / total * 100
  return quotient.toFixed(decimals) + '%'
}

function formatInteger(number){
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getFigureWithTodaysCount(confirmedCases,saludTimeSignature,newCasesToday){
  var text = formatInteger(confirmedCases)
  const splitBySpaces = saludTimeSignature.split(' ')
  var dateIndex = 0
  for (var i = 0; i < splitBySpaces.length; i++) {
    const word = splitBySpaces[i]
    if (isNaN(word) == false){
      dateIndex = i
      break
    }
  }

  const saludDayOfMonth = splitBySpaces[dateIndex]
  console.log("saludDayOfMonth",saludDayOfMonth)
  const dateFromToday = saludDayOfMonth == (new Date).getDate()

  text =  dateFromToday ? text + `${formatInteger(newCasesToday)} hoy` : text
  return text
}


function createDataObject(data,xKey,yKey,graphOptionAbsolute,graphOptionChange){
  var formattedData = []
  var formattedDeltaData = []
  for (var i = 0; i < data.length; i++) {
    const entry = data[i]
    var xShorthand = entry[xKey]
    if (xKey == "timestamp"){
      const dateObj = new Date(entry[xKey])
      xShorthand = `${dateObj.getDate()}-${MONTHS_ES[dateObj.getMonth()+1]}`
    }

    var yValue = entry[yKey]
    if (!yValue){
      continue
    }
    console.log(`Y value is ${yValue}`)
    if (i >= 1){
      const prevEntry = data[i-1]
      const prevYvalue = prevEntry[yKey]
      console.log(`prevY value is ${prevYvalue}`)
      const delta = yValue - prevYvalue
      if (isNaN(delta)){
        console.log("SKIPPING delta:",delta)
        continue
      }
      const formattedDelta = {"x":xShorthand,"y":delta}
      formattedDeltaData.push(formattedDelta)
    }

    const formattedEntry = {"x":xShorthand,"y":yValue}
    formattedData.push(formattedEntry)
  }

  // formattedDeltaData = [formattedDeltaData[0]].concat(formattedDeltaData)
  const dataObject = {
  "id": attributeToChartOptions[yKey].yAxisLabel,
  "color":BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES[yKey]],
  "data": formattedData}

  const deltaObject = {
  "id": "Cambio ese día",
  "color":DELTA_LINE_COLOR,
  "data": formattedDeltaData}
  console.log("formattedData",formattedData)
  console.log("formattedDeltaData",formattedDeltaData)

  var dataList = []
  if (graphOptionAbsolute){
    dataList.push(dataObject)
  }

  if (graphOptionChange){
    dataList.push(deltaObject)
  }

  return dataList
}


function getDataBlock(blockType,text,borderTopLeftRadius=0,borderTopRightRadius=0,borderBottomLeftRadius=0,borderBottomRightRadius=0,fontSize=null){
  if (blockType == "label"){
    var backgroundColor = DATA_LABEL_BACKGROUND_COLOR
    fontSize = fontSize ? fontSize : LABEL_FONT_SIZE
    var blockHeight = LABEL_BLOCK_HEIGHT
    var fontColor = DATA_VALUE_TEXT_COLOR
  }
  else if (blockType == "data"){
    var backgroundColor = DATA_VALUE_BACKGROUND_COLOR
    fontSize = fontSize ? fontSize : DATA_FONT_SIZE
    var blockHeight = DATA_BLOCK_HEIGHT
    var fontColor = "black"
  }


  return (
    <div style={{width: "20vw",maxWidth: "160px",minWidth: "100px",height: blockHeight,
      borderTopLeftRadius: borderTopLeftRadius,borderTopRightRadius:borderTopRightRadius,borderBottomLeftRadius: borderBottomLeftRadius,borderBottomRightRadius:borderBottomRightRadius,
      backgroundColor: backgroundColor,color:fontColor,
      alignItems:'center',justifyContent:'center',textAlign: 'center',fontSize: fontSize}}>
      {text}
    </div>
  )
}

class Home extends Component{
  constructor(props){
    super(props)
    const defaultXY = [{confirmedCases:100,timestamp:0},{confirmedCases:200,timestamp:1}]

    const initialState = {
            conductedTests:0,
            confirmedCases:0,
            deaths:0,
            negativeCases:0,
            testsInProgress:0,
            timestamp:0,
            saludTimeSignature:'',
            historicalData:defaultXY,
            attributeToGraph:'confirmedCases',
            PRpopulation:3.194*(10**6),
            graphColors:[BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES['confirmedCases']],DELTA_LINE_COLOR],
            newCasesToday:0,
            newDeathsToday:0,
            graphOptionAbsolute:true,
            graphOptionChange:false,
          }
    for (var i = 0; i < ATTRIBUTES.length; i++) {
      const attribute = ATTRIBUTES[i]
      var defaultButtonVariant = 'light'
      if (attribute == "confirmedCases"){
        defaultButtonVariant = 'warning'
      }

      initialState[`${attribute}ButtonVariant`] = defaultButtonVariant
    }

    this.state = initialState
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
      const lengthOfData = historicalData.length
      this.setState({historicalData:historicalData,
                    newCasesToday:historicalData[lengthOfData-1].confirmedCases - historicalData[lengthOfData-2].confirmedCases,
                    newDeathsToday:historicalData[lengthOfData-1].deaths - historicalData[lengthOfData-2].deaths
                  })

    }
}
  chooseButton = (attributeToGraph)=>{
    var newState = this.state
    for (var i = 0; i < ATTRIBUTES.length; i++) {
      const attribute = ATTRIBUTES[i];
      const stateItem = `${attribute}ButtonVariant`

      if (attribute == attributeToGraph){
        const variantClass = ATTRIBUTES_TO_CLASSES[attribute]
        newState[stateItem] = variantClass
        newState.attributeToGraph = attribute
        this.state.graphColors = [BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES[attribute]],DELTA_LINE_COLOR]
      } else{
        newState[stateItem] = 'light'
      }
    }
    this.setState({...newState})
  }

  toggleGraphOption = (option) =>{
    const absoluteCurrentToggle = this.state.graphOptionAbsolute
    const changeCurrentToggle = this.state.graphOptionChange

    if (option == 'absolute'){
      if (changeCurrentToggle){
        this.setState({graphOptionAbsolute:!absoluteCurrentToggle})
      }
    }
    else if (option == 'change'){
      if (absoluteCurrentToggle){
        this.setState({graphOptionChange:!changeCurrentToggle})
      }
    }

  }

  render (){

    const attributeToGraph = this.state.attributeToGraph

    const dataObjectForChart = createDataObject(this.state.historicalData,attributeToChartOptions[attributeToGraph].xKey,attributeToChartOptions[attributeToGraph].yKey,
          this.state.graphOptionAbsolute,this.state.graphOptionChange)
    const xAxisLabel = attributeToChartOptions[attributeToGraph].xAxisLabel
    const yAxisLabel = attributeToChartOptions[attributeToGraph].yAxisLabel

    return (
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',paddingTop: 0}}>
        <div style={{display:'flex',flexDirection:'row',paddingTop: 2}}>
          <div style={{fontSize: 30,fontWeight: 'bold',divAlign:'center'}}>{"COVID-19 en\n Puerto Rico🇵🇷"}</div>
        </div>
        <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
          <div style={{display: 'flex',flexDirection: 'column'}}>

            <div style={{display: 'flex',flexDirection: 'column'}}>
              <div style={{display:'flex',flexDirection:'row',paddingTop: 5}}>
                {getDataBlock("label","Casos positivos",15)}
                {getDataBlock("label","Casos negativos")}
                {getDataBlock("label","Muertes",0,15)}

              </div>
              <div style={{display:'flex',flexDirection:'row'}}>
                {getDataBlock("data",getFigureWithTodaysCount(this.state.confirmedCases,this.state.saludTimeSignature,this.state.newCasesToday),0,0,15)}
                {getDataBlock("data",formatInteger(this.state.negativeCases))}
                {getDataBlock("data",getFigureWithTodaysCount(this.state.deaths,this.state.saludTimeSignature,this.state.newDeathsToday),0,0,0,15)}
              </div>
            </div>
          </div>
          <div style={{display: 'flex',flexDirection: 'row'}}>
            <div style={{display: 'flex',flexDirection: 'column'}}>
              <div style={{display:'flex',flexDirection:'row',paddingTop: 10}}>
                {getDataBlock("label","Porciento Positivo",15)}
                {getDataBlock("label","Porciento Negativo")}
                {getDataBlock("label","Porciento de muertes",0,15)}
              </div>
              <div style={{display:'flex',flexDirection:'row'}}>
                {getDataBlock("data",this.state.conductedTests != 0 ? getPercent(this.state.confirmedCases,this.state.conductedTests,1) : 0,0,0,15)}
                {getDataBlock("data",this.state.conductedTests != 0 ? getPercent(this.state.negativeCases,this.state.conductedTests,1) : 0)}
                {getDataBlock("data",this.state.conductedTests != 0 ? getPercent(this.state.deaths,this.state.confirmedCases,2) : 0,0,0,0,15)}
              </div>
            </div>
          </div>
          <div style ={{display:'flex',flexDirection:'row'}}>
            <div style={{display: 'flex',flexDirection: 'column'}}>
              <div style={{display:'flex',flexDirection:'row',paddingTop: 10}}>
                {getDataBlock("label","Porciento de puertorriqueños infectados",15,0,0,0,13)}
                {getDataBlock("label","Pruebas en proceso")}
                {getDataBlock("label","Pruebas realizadas",0,15)}

              </div>

              <div style={{display:'flex',flexDirection:'row'}}>
                {getDataBlock("data",this.state.PRpopulation ? getPercent(this.state.confirmedCases,this.state.PRpopulation,3) : 0,0,0,15)}
                {getDataBlock("data",formatInteger(this.state.testsInProgress))}
                {getDataBlock("data",formatInteger(this.state.conductedTests),0,0,0,15)}
              </div>
            </div>

          </div>
        </div>

        <div style={{textAlign:'center'}}>Qué graficar:</div>
        <div style={{display:'flex',flexDirection:'row'}}>
          <Button onClick={()=>this.toggleGraphOption('absolute')} variant={this.state.graphOptionAbsolute ? 'primary' : 'light'}>Data por día</Button>{' '}
          <Button onClick={()=>this.toggleGraphOption('change')} variant={this.state.graphOptionChange ? 'primary' : 'light'}>Cambio por día</Button>{' '}
        </div>
        <div style={{display:'flex',flexDirection:'row',padding:10}}>
          <Button onClick={()=>this.chooseButton('confirmedCases')} variant={this.state.confirmedCasesButtonVariant}>Casos positivos</Button>{' '}
          <Button onClick={()=>this.chooseButton('conductedTests')} variant={this.state.conductedTestsButtonVariant}>Pruebas administradas</Button>{' '}
          <Button onClick={()=>this.chooseButton('negativeCases')} variant={this.state.negativeCasesButtonVariant}>Casos negativos</Button>{' '}
          <Button onClick={()=>this.chooseButton('testsInProgress')} variant={this.state.testsInProgressButtonVariant}>Pruebas en proceso</Button>{' '}
          <Button onClick={()=>this.chooseButton('deaths')} variant={this.state.deathsButtonVariant}>Muertes</Button>{' '}
        </div>

        <div style={{height:500,width:"80%",justifyContent: 'center',backgroundColor: 'white',borderRadius: 15}}>
          {LineChart(dataObjectForChart,xAxisLabel,yAxisLabel,this.state.graphColors)}
        </div>
        <div style={{display:'flex',flexDirection:'row',textAlign: 'center',height: 100}}>
          <div>{`${this.state.saludTimeSignature ? this.state.saludTimeSignature : ""}`}</div>
        </div>

      </div>
    );
  }

}
export default Home;
