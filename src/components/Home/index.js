import React, {Component,useState} from 'react';
import { Button, Alert,Modal} from 'react-bootstrap';
import LineChart from '../LineChart';
import { CSVLink } from "react-csv";
import * as Icon from 'react-bootstrap-icons';



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
    yAxisLabel: 'Casos positivos únicos'
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

function removeParentheses(string){
  var output = ""
  for (var i = 0; i < string.length; i++) {
    let char = string[i]
    if (char === ")" || char === "("){
      continue
    }
    else{
      output+=char
    }
  }
  return output
}

function getFigureWithTodaysCount(confirmedCases,saludTimeSignature,newCasesToday){
  var text = formatInteger(confirmedCases)
  const splitBySpaces = saludTimeSignature.split(' ')
  var dateIndex = 0
  for (var i = 0; i < splitBySpaces.length; i++) {
    const word = splitBySpaces[i]
    if (isNaN(word) === false){
      dateIndex = i
      break
    }
  }

  const saludDayOfMonth = splitBySpaces[dateIndex]
  const dateFromToday = saludDayOfMonth === (new Date()).getDate()

  text =  dateFromToday ? text + `${formatInteger(newCasesToday)} hoy` : text
  return text
}


function createDataObject(data,xKey,yKey,graphOptionAbsolute,graphOptionChange){
  var formattedData = []
  var formattedDeltaData = []
  for (var i = 0; i < data.length; i++) {
    const entry = data[i]
    var xShorthand = entry[xKey]
    if (xKey === "timestamp"){
      const dateObj = new Date(entry[xKey])
      xShorthand = `${dateObj.getDate()}-${MONTHS_ES[dateObj.getMonth()+1]}`
    }

    var yValue = entry[yKey]
    if (!yValue){
      continue
    }
    if (i >= 1){
      const prevEntry = data[i-1]
      const prevYvalue = prevEntry[yKey]
      const delta = yValue - prevYvalue
      if (isNaN(delta)){
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
  "id": "Cambio",
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


function DataBlock(props){
  var classForBlock = ""
  if (props.blockType === "label"){
    classForBlock = 'labelBlock'
  }
  else if (props.blockType === "data"){
    classForBlock = 'dataBlock'
  }


  return (
    <div className={`${classForBlock} dashboardBlock`} style={{
      borderTopLeftRadius: props.borderTopLeftRadius ? props.borderTopLeftRadius : 0,
      borderTopRightRadius:props.borderTopRightRadius ? props.borderTopRightRadius: 0,
      borderBottomLeftRadius: props.borderBottomLeftRadius ? props.borderBottomLeftRadius: 0,
      borderBottomRightRadius:props.borderBottomRightRadius ? props.borderBottomRightRadius : 0,
      fontSize: props.fontSize ? props.fontSize : ""
    }}
      onClick={props.onClick}
    >
      {props.text}
    </div>
  )
}

const AlertHeader = (props) =>
   (
  <Alert style={{width: "80%"}}variant="primary" onClose={props.onClose} dismissible>
         <Alert.Heading>Cambio de datos disponibles</Alert.Heading>
         <p>
         (1) Hubo un lapso de tiempo entre el 23 de abril y el 5 de mayo 2020 en lo cual el Departmento de Salúd no publicó data en su sitio web del coronavirus.<br/>
         (2) Desde el 5 de mayo del 2020, el Departmento de Salúd sólo publica el número de casos positivos únicos (a diferencia de número de pruebas positivos totales),
         pruebas moleculares, pruebas serológicas y muertes en su página oficial. Seguiremos manteniendo el historial
         de los números de pruebas realizadas, casos negativos y pruebas en procesamiento hasta la fecha del 23 de abril, que fue el último día en cual se ofrecieron estos datos.
         </p>
  </Alert>
)

function InfoModal(props) {

  return (
    <>
      <Modal show={props.modalVisible} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.modalHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.modalBody}</Modal.Body>
      </Modal>
    </>
  );
}

class Home extends Component{
  constructor(props){
    super(props)
    const defaultXY = [{confirmedCases:100,timestamp:0},{confirmedCases:200,timestamp:1}]

    const initialState = {
            // conductedTests:0,
            confirmedCases:0,
            deaths:0,
            // negativeCases:0,
            // testsInProgress:0,
            molecularTests:0,
            serologicalTests:0,
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
      if (attribute === "confirmedCases"){
        defaultButtonVariant = 'warning'
      }

      initialState[`${attribute}ButtonVariant`] = defaultButtonVariant
    }

    this.state = initialState
  }





  async componentDidMount(){
    this.props.firebase.logEvent("Visited site")
    var todaysData = await this.props.firebase.getTodaysData()
    if (todaysData.exists){
        var data = todaysData.data()
        this.setState({
        alertVisible:true,
        modalVisible:false,
        modalBody:"",
        conductedTests:data.conductedTests,
        confirmedCases:data.confirmedCases,
        molecularTests:data.molecularTests,
        serologicalTests:data.serologicalTests,
        deaths:data.deaths,
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
                    newDeathsToday:historicalData[lengthOfData-1].deaths - historicalData[lengthOfData-2].deaths,
                    newMolecularTestsToday:historicalData[lengthOfData-1].molecularTests - historicalData[lengthOfData-2].molecularTests,
                    newSerologicaltestsToday:historicalData[lengthOfData-1].serologicalTests - historicalData[lengthOfData-2].serologicalTests,
                  })

    }
}
  chooseButton = (attributeToGraph)=>{
    var newState = this.state
    for (var i = 0; i < ATTRIBUTES.length; i++) {
      const attribute = ATTRIBUTES[i];
      const stateItem = `${attribute}ButtonVariant`

      if (attribute === attributeToGraph){
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

    if (option === 'absolute'){
      if (changeCurrentToggle){
        this.setState({graphOptionAbsolute:!absoluteCurrentToggle})
      }
    }
    else if (option === 'change'){
      if (absoluteCurrentToggle){
        this.setState({graphOptionChange:!changeCurrentToggle})
      }
    }

  }

  getDataForDownload = () =>{
    const dataObjectForChart = createDataObject(this.state.historicalData,attributeToChartOptions[this.state.attributeToGraph].xKey,
                                                attributeToChartOptions[this.state.attributeToGraph].yKey,
                                                this.state.graphOptionAbsolute,this.state.graphOptionChange)
    var csv = [["fecha",this.state.attributeToGraph]]
    for (var i = 0; i < dataObjectForChart.length; i++) {
      let data = dataObjectForChart[i].data
      if (i === 1){
        csv.push(["fecha","Cambio en "+this.state.attributeToGraph])
      }
      for (var j = 0; j < data.length; j++) {
        let date = data[j].x
        let value = data[j].y
        csv.push([date,value])
      }
    }
    return csv
  }

  render (){


    const dataObjectForChart = createDataObject(this.state.historicalData,attributeToChartOptions[this.state.attributeToGraph].xKey,attributeToChartOptions[this.state.attributeToGraph].yKey,
          this.state.graphOptionAbsolute,this.state.graphOptionChange)
    const xAxisLabel = attributeToChartOptions[this.state.attributeToGraph].xAxisLabel
    const yAxisLabel = attributeToChartOptions[this.state.attributeToGraph].yAxisLabel

    return (
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',marginTop:10,backgroundColor: 'white'}}>
        <div style={{display:'flex',flexDirection:'column',marginTop: 20,alignItems: 'center'}}>
          <div className="title">
            COVID-19 en Puerto Rico
          </div>
          <InfoModal modalVisible={this.state.modalVisible} modalHeader={this.state.modalHeader} modalBody={this.state.modalBody} handleShow={()=>this.setState({modalVisible:true})} handleClose={()=>this.setState({modalVisible:false})}/>
        </div>
        {this.state.alertVisible ? <AlertHeader onClose={()=>this.setState({alertVisible:false})}/> : <div/>}
        <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',margin:20}}>
          <div style={{display: 'flex',flexDirection: 'column'}}>

            <div style={{display: 'flex',flexDirection: 'column'}}>
              <div style={{display:'flex',flexDirection:'row'}}>
                <DataBlock blockType="label" text="Casos positivos únicos" borderTopLeftRadius={15} fontSize='2.7vh'
                  onClick={()=>this.setState({modalVisible:true,modalHeader:"Casos positivos únicos",modalBody:"Es el número de casos positivos atribuidos a una sola persona. Antes del 5 de mayo del 2020, el Departmento de Salúd publicaba el número de pruebas positivas que no necesariamente correspondía al número de personas que probaron positivo al COVID-19."})}/>

                <DataBlock blockType="label" text="Prueba molecular"
                  onClick={()=>this.setState({modalVisible:true,modalHeader:"Prueba molecular",modalBody:"Este dato es el número de casos positivos del COVID-19 de acuerdo a pruebas moleculares. Éstas detectan directamente el ARN (ácido ribonucleico), es decir, el material genético del virus, en las muestras tomadas de secreciones respiratorias del paciente."})}/>

                <DataBlock blockType="label" text="Prueba serológica"
                  onClick={()=>this.setState({modalVisible:true,modalHeader:"Prueba serológica",modalBody:"Este dato representa el número de casos positivos del COVID-19 de acuerdo a pruebas serólogicas. La prueba serológica detecta nuestra respuesta inmunológica contra el patógeno. Éstas son referidas como \"pruebas rápidas\", pues ofrecen resultados en 10 minutos."})}/>

                <DataBlock blockType="label" text="Muertes" borderTopRightRadius={15}
                  onClick={()=>this.setState({modalVisible:true,modalHeader:"Muertes",modalBody:"Este número representa el número de muertes atribuídas a COVID-19 en Puerto Rico."})}/>


              </div>
              <div style={{display:'flex',flexDirection:'row'}}>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(this.state.confirmedCases,this.state.saludTimeSignature,this.state.newCasesToday)} borderBottomLeftRadius={15}/>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(this.state.molecularTests,this.state.saludTimeSignature,this.state.newMolecularTestsToday)}/>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(this.state.serologicalTests,this.state.saludTimeSignature,this.state.newSerologicaltestsToday)}/>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(this.state.deaths,this.state.saludTimeSignature,this.state.newDeathsToday)} borderBottomRightRadius={15} />
              </div>
            </div>
          </div>
          <div style={{display: 'flex',flexDirection: 'row'}}>
            <div style={{display: 'flex',flexDirection: 'column'}}>
              <div style={{display:'flex',flexDirection:'row',paddingTop: 10}}>
              </div>
              <div style={{display:'flex',flexDirection:'row'}}>
              </div>
            </div>
          </div>
          <div style ={{display:'flex',flexDirection:'row'}}>
            <div style={{display: 'flex',flexDirection: 'column'}}>
              <div style={{display:'flex',flexDirection:'row',paddingTop: 10}}>
                <DataBlock blockType="label" text="Porciento de puertorriqueños infectados" borderTopLeftRadius={15} fontSize="2.5vh"
                  onClick={()=>this.setState({modalVisible:true,modalHeader:"Porciento de puertorriqueños infectados",modalBody:"Este número representa el número de casos positivos dividido entre 3.194 millón (cifra de población de Puerto Rico)."})}/>

                <DataBlock blockType="label" text="Porciento de muertes" borderTopRightRadius={15}
                  onClick={()=>this.setState({modalVisible:true,modalHeader:"Porciento de muertes",modalBody:"Este número representa el número de muertes atribuidas al COVID-19 dividido entre los casos positivos únicos."})}/>


              </div>

              <div style={{display:'flex',flexDirection:'row'}}>
                <DataBlock blockType="data" text={this.state.PRpopulation ? getPercent(this.state.confirmedCases,this.state.PRpopulation,3) : 0} borderBottomLeftRadius={15}/>
                <DataBlock blockType="data" text={this.state.confirmedCases !== 0 ? getPercent(this.state.deaths,this.state.confirmedCases,2) : 0} borderBottomRightRadius={15}/>


              </div>
            </div>

          </div>
        </div>

        <div style={{textAlign:'center',marginTop: 10}}>Qué graficar:</div>
        <div style={{display:'flex',flexDirection:'row'}}>
          <Button onClick={()=>this.toggleGraphOption('absolute')} variant={this.state.graphOptionAbsolute ? 'primary' : 'light'}>Data por día</Button>{' '}
          <Button onClick={()=>this.toggleGraphOption('change')} variant={this.state.graphOptionChange ? 'primary' : 'light'}>Cambio por día</Button>{' '}
        </div>
        <div className="attributeToGraphSelection">
          <Button onClick={()=>this.chooseButton('confirmedCases')} variant={this.state.confirmedCasesButtonVariant}>Casos positivos únicos</Button>{' '}
          <Button onClick={()=>this.chooseButton('conductedTests')} variant={this.state.conductedTestsButtonVariant}>Pruebas administradas</Button>{' '}
          <Button onClick={()=>this.chooseButton('negativeCases')} variant={this.state.negativeCasesButtonVariant}>Casos negativos</Button>{' '}
          <Button onClick={()=>this.chooseButton('testsInProgress')} variant={this.state.testsInProgressButtonVariant}>Pruebas en proceso</Button>{' '}
          <Button onClick={()=>this.chooseButton('deaths')} variant={this.state.deathsButtonVariant}>Muertes</Button>{' '}
        </div>

        <div style={{height:"70vh",width:"90vw",minWidth: "550px",justifyContent: 'center',backgroundColor: 'white',borderRadius: 15}}>
          {LineChart(dataObjectForChart,xAxisLabel,yAxisLabel,this.state.graphColors)}
        </div>
        <div style={{display:'flex',flexDirection:'row',textAlign: 'center',margin: 5}}>
          <div>{`${this.state.saludTimeSignature ? this.state.saludTimeSignature : ""}`}</div>
        </div>
        <div style={{margin: 5,marginBottom: 20}}>
          <CSVLink data={this.getDataForDownload()} filename={`${this.state.attributeToGraph}${removeParentheses(this.state.saludTimeSignature)}.csv`}>
            <Button variant="success">Bajar data <Icon.Download /></Button>
          </CSVLink>
        </div>
        <div style={{display: 'flex',flexDirection: 'column',height: "10vh",alignItems: 'center',textAlign: 'center',marginBottom: 40}}>
          <div style={{fontSize: 13}}>*La data provista fue obtenida del sitio web del Departamento de Salúd del coronavirus (<a href="http://www.salud.gov.pr/Pages/coronavirus.aspx">http://www.salud.gov.pr/Pages/coronavirus.aspx</a>) y está sujeta a cambio y/o clarificación.</div>
          <div style={{fontSize: 13,margin:10}}>&copy; 2020 <a href="https://github.com/williamrodz/covid19-puertorico-web/blob/master/LICENSE.txt">Licencia</a></div>
          <div style={{fontSize: 13,margin:20,}}> Hecho con <span style={{color: '#e25555'}}>&#9829;</span> por <a href="https://twitter.com/williamrodz" target="_blank" onClick={(event) => {event.preventDefault(); window.open("https://twitter.com/williamrodz");}}>William Rodríguez Jiménez</a></div>
        </div>

      </div>
    );
  }

}
export default Home;
