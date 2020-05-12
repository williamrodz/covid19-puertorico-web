import React, {useState,useEffect} from 'react';
import { Button, Alert,Modal} from 'react-bootstrap';
import LineChart from '../LineChart';
import { CSVLink } from "react-csv";
import * as Icon from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';



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

const PR_POPULATION = 3.194*(10**6)



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

  const locationOfAl = saludTimeSignature.indexOf("al ")
  const dateNumberStart = locationOfAl + 3
  const dateNumberEnd = saludTimeSignature[dateNumberStart+1] === " " ? dateNumberStart+1 : dateNumberStart+2


  const saludDayOfMonth = parseInt(saludTimeSignature.substring(dateNumberStart,dateNumberEnd))
  const todaysDayOfMonth = (new Date()).getDate()
  // console.log("saludDayOfMonth",saludDayOfMonth)
  // console.log("todaysDayOfMonth",todaysDayOfMonth)

  const dateFromToday = saludDayOfMonth === todaysDayOfMonth
  // console.log("dateFromToday",dateFromToday)
  // console.log("newCasesToday",newCasesToday)
  if (dateFromToday){
    return (<div style={{display:'flex',flexDirection:'column'}}>
              <div>{text}</div>
              <div>{`(+${formatInteger(newCasesToday)}`} {window.innerWidth > 767 ? 'hoy)' : ')'}</div>
            </div>)
  } else{
    return text
  }
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
      fontSize: props.fontSize ? props.fontSize : "",
      position: 'relative',
    }}
    >
      {props.text}
      {props.blockType === "label" ? <Icon.InfoCircle onClick={props.infoClick} className="infoCircle"/>: null }
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
        <Modal.Footer>
          <Button variant="primary" onClick={()=>props.handleClose()}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default function Home(props) {

    const [cookie, setCookie] = useCookies();
    console.log("cookie",cookie)

    var buttonVariants = {}

    for (var i = 0; i < ATTRIBUTES.length; i++) {
      const attribute = ATTRIBUTES[i]
      var defaultButtonVariant = 'light'
      if (attribute === "confirmedCases"){
        defaultButtonVariant = 'warning'
      }
      buttonVariants[`${attribute}ButtonVariant`] = defaultButtonVariant
    }

    const [UIstate,setUIState] = useState({
                attributeToGraph:'confirmedCases',
                graphColors:[BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES['confirmedCases']],DELTA_LINE_COLOR],
                graphOptionAbsolute:true,
                graphOptionChange:false,
                ...buttonVariants,
                alertVisible:cookie.ui ? cookie.ui.alertVisible : true,
              })
    const [historicalData,setHistoricalData] = useState({
      all:[],
      newCasesToday: 0,
      newDeathsToday:0,
      newMolecularTestsToday: 0,
      newSerologicalTestsToday: 0,
    })
    const [today,setTodaysData] = useState({
      confirmedCases: cookie.today ? cookie.today.confirmedCases : 0,
      molecularTests:cookie.today ? cookie.today.molecularTests : 0,
      serologicalTests:cookie.today ? cookie.today.serologicalTests : 0,
      deaths:cookie.today ? cookie.today.deaths : 0,
      saludTimeSignature:cookie.today ? cookie.today.saludTimeSignature : "",
      timestamp:cookie.today ? cookie.today.timestamp : "",

    });



  useEffect(()=>{
    const fetchFirebaseData = async ()=>{

      var todaysDataFromFireBase = {}
      if (cookie.today && (new Date(cookie.today.timestamp)).getDate() === (new Date()).getDate() ){
        todaysDataFromFireBase = cookie.today
      } else{
        console.log("FETCHING TODAYS DATA")
        var todaysDataRef = await props.firebase.getTodaysData()
        todaysDataFromFireBase = todaysDataRef.exists ? {...todaysDataRef.data()} : null
      }


      const historicalDataRef = await props.firebase.getHistoricalData()
      console.log("FETCHING HISTORICAL DATA")
      var historicalDataFromFireBase = {}
      if (historicalDataRef.exists){
        const historicalData = historicalDataRef.data().all
        const lengthOfData = historicalData.length
        historicalDataFromFireBase = {
          all:historicalData,
          newCasesToday:historicalData[lengthOfData-1].confirmedCases - historicalData[lengthOfData-2].confirmedCases,
          newDeathsToday:historicalData[lengthOfData-1].deaths - historicalData[lengthOfData-2].deaths,
          newMolecularTestsToday:historicalData[lengthOfData-1].molecularTests - historicalData[lengthOfData-2].molecularTests,
          newSerologicalTestsToday:historicalData[lengthOfData-1].serologicalTests - historicalData[lengthOfData-2].serologicalTests,
          }
      }
      setHistoricalData({...historicalDataFromFireBase})
      setTodaysData({...todaysDataFromFireBase})

      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0,0,0,0)

      setCookie("today",{...todaysDataFromFireBase,expirationDate:tomorrow},{expires:tomorrow})

    }

    fetchFirebaseData();
  },[props.firebase])


  const chooseButton = (attributeToGraph)=>{
    var newState = UIstate
    for (var i = 0; i < ATTRIBUTES.length; i++) {
      const attribute = ATTRIBUTES[i];
      const stateItem = `${attribute}ButtonVariant`

      if (attribute === attributeToGraph){
        const variantClass = ATTRIBUTES_TO_CLASSES[attribute]
        newState[stateItem] = variantClass
        newState.attributeToGraph = attribute
        newState.graphColors = [BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES[attribute]],DELTA_LINE_COLOR]
      } else{
        newState[stateItem] = 'light'
      }
    }
    setUIState({...UIstate},{...newState})
  }

  const toggleGraphOption = (option) =>{
    const absoluteCurrentToggle = UIstate.graphOptionAbsolute
    const changeCurrentToggle = UIstate.graphOptionChange

    if (option === 'absolute'){
      if (changeCurrentToggle){
        setUIState({...UIstate,graphOptionAbsolute:!absoluteCurrentToggle})
      }
    }
    else if (option === 'change'){
      if (absoluteCurrentToggle){
        setUIState({...UIstate,graphOptionChange:!changeCurrentToggle})
      }
    }

  }

  const getDataForDownload = () =>{
    console.log("--Preparing data for future download--")
    const dataObjectForChart = createDataObject(historicalData.all,attributeToChartOptions[UIstate.attributeToGraph].xKey,
                                                attributeToChartOptions[UIstate.attributeToGraph].yKey,
                                                UIstate.graphOptionAbsolute,UIstate.graphOptionChange)
    var csv = [["fecha",UIstate.attributeToGraph]]
    for (var i = 0; i < dataObjectForChart.length; i++) {
      let data = dataObjectForChart[i].data
      if (i === 1){
        csv.push(["fecha","Cambio en "+UIstate.attributeToGraph])
      }
      for (var j = 0; j < data.length; j++) {
        let date = data[j].x
        let value = data[j].y
        csv.push([date,value])
      }
    }
    return csv
  }


  const closeAlert = async () =>{
    setUIState({...UIstate,alertVisible:false})
    setCookie("ui",{...UIstate,alertVisible:false})
  }



    const dataObjectForChart = createDataObject(historicalData.all,attributeToChartOptions[UIstate.attributeToGraph].xKey,attributeToChartOptions[UIstate.attributeToGraph].yKey,
          UIstate.graphOptionAbsolute,UIstate.graphOptionChange)
    const xAxisLabel = attributeToChartOptions[UIstate.attributeToGraph].xAxisLabel
    const yAxisLabel = attributeToChartOptions[UIstate.attributeToGraph].yAxisLabel

    return (
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',marginTop:10,backgroundColor: 'white'}}>
        <div style={{display:'flex',flexDirection:'column',marginTop: 20,alignItems: 'center'}}>
          <div className="title">
            COVID-19 en Puerto Rico
          </div>
          <InfoModal modalVisible={UIstate.modalVisible} modalHeader={UIstate.modalHeader} modalBody={UIstate.modalBody} handleShow={()=>setUIState({...UIstate,modalVisible:true})} handleClose={()=>setUIState({...UIstate,modalVisible:false})}/>
        </div>
        {UIstate.alertVisible ? <AlertHeader onClose={closeAlert}/> : <div/>}
        <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',margin:20}}>
          <div style={{display: 'flex',flexDirection: 'column'}}>

            <div style={{display: 'flex',flexDirection: 'column'}}>
              <div style={{display:'flex',flexDirection:'row'}}>
                <DataBlock blockType="label" text="Casos positivos únicos" borderTopLeftRadius={15}
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:"Casos positivos únicos",modalBody:"Es el número de casos positivos atribuidos a una sola persona. Antes del 5 de mayo del 2020, el Departmento de Salúd publicaba el número de pruebas positivas que no necesariamente correspondía al número de personas que probaron positivo al COVID-19."})}/>

                <DataBlock blockType="label" text="Prueba molecular"
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:"Prueba molecular",modalBody:"Éste es el número de casos positivos del COVID-19 de acuerdo a pruebas moleculares. Éstas detectan directamente el ARN (ácido ribonucleico), es decir, el material genético del virus, en las muestras tomadas de secreciones respiratorias del paciente."})}/>

                <DataBlock blockType="label" text="Prueba serológica"
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:"Prueba serológica",modalBody:"Este dato representa el número de casos positivos del COVID-19 de acuerdo a pruebas serólogicas. La prueba serológica detecta nuestra respuesta inmunológica contra el patógeno. Éstas son referidas como \"pruebas rápidas\", pues ofrecen resultados en 10 minutos."})}/>

                <DataBlock blockType="label" text="Muertes" borderTopRightRadius={15}
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:"Muertes",modalBody:"Este número representa el número de muertes atribuídas a COVID-19 en Puerto Rico."})}/>


              </div>
              <div style={{display:'flex',flexDirection:'row'}}>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(today.confirmedCases,today.saludTimeSignature,historicalData.newCasesToday)} borderBottomLeftRadius={15}/>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(today.molecularTests,today.saludTimeSignature,historicalData.newMolecularTestsToday)}/>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(today.serologicalTests,today.saludTimeSignature,historicalData.newSerologicalTestsToday)}/>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(today.deaths,today.saludTimeSignature,historicalData.newDeathsToday)} borderBottomRightRadius={15} />
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
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:"Porciento de puertorriqueños infectados",modalBody:"Este número representa el número de casos positivos dividido entre 3.194 millón (cifra de población de Puerto Rico)."})}/>

                <DataBlock blockType="label" text="Porciento de muertes" borderTopRightRadius={15}
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:"Porciento de muertes",modalBody:"Este número representa el número de muertes atribuidas al COVID-19 dividido entre los casos positivos únicos."})}/>


              </div>

              <div style={{display:'flex',flexDirection:'row'}}>
                <DataBlock blockType="data" text={PR_POPULATION ? getPercent(today.confirmedCases,PR_POPULATION,3) : 0} borderBottomLeftRadius={15}/>
                <DataBlock blockType="data" text={today.confirmedCases !== 0 ? getPercent(today.deaths,today.confirmedCases,2) : 0} borderBottomRightRadius={15}/>


              </div>
            </div>

          </div>
        </div>

        <div style={{textAlign:'center',marginTop: 10}}>Qué graficar:</div>
        <div style={{display:'flex',flexDirection:'row'}}>
          <Button onClick={()=>toggleGraphOption('absolute')} variant={UIstate.graphOptionAbsolute ? 'primary' : 'light'}>Data por día</Button>{' '}
          <Button onClick={()=>toggleGraphOption('change')} variant={UIstate.graphOptionChange ? 'primary' : 'light'}>Cambio por día</Button>{' '}
        </div>
        <div className="attributeToGraphSelection">
          <Button onClick={()=>chooseButton('confirmedCases')} variant={UIstate.confirmedCasesButtonVariant}>Casos positivos únicos</Button>{' '}
          <Button onClick={()=>chooseButton('conductedTests')} variant={UIstate.conductedTestsButtonVariant}>Pruebas administradas</Button>{' '}
          <Button onClick={()=>chooseButton('negativeCases')} variant={UIstate.negativeCasesButtonVariant}>Casos negativos</Button>{' '}
          <Button onClick={()=>chooseButton('testsInProgress')} variant={UIstate.testsInProgressButtonVariant}>Pruebas en proceso</Button>{' '}
          <Button onClick={()=>chooseButton('deaths')} variant={UIstate.deathsButtonVariant}>Muertes</Button>{' '}
        </div>

        <div className="chartContainer">
          <LineChart data={dataObjectForChart} xAxisLabel={xAxisLabel} yAxisLabel={yAxisLabel} graphColors={UIstate.graphColors}/>
        </div>
        <div style={{display:'flex',flexDirection:'row',textAlign: 'center',margin: 5}}>
          <div>{`${today.saludTimeSignature ? today.saludTimeSignature : ""}`}</div>
        </div>
        <div style={{margin: 5,marginBottom: 20}}>
          <CSVLink data={getDataForDownload()} filename={`${UIstate.attributeToGraph}${removeParentheses(today.saludTimeSignature)}.csv`}>
            <Button variant="success">Bajar data <Icon.Download /></Button>
          </CSVLink>
        </div>
        <div style={{display: 'flex',flexDirection: 'column',height: "10vh",alignItems: 'center',textAlign: 'center',marginBottom: 40}}>
          <div style={{fontSize: 13}}>*La data provista fue obtenida del sitio web del Departamento de Salúd del coronavirus (<a href="http://www.salud.gov.pr/Pages/coronavirus.aspx" target="_blank" rel="noopener noreferrer">http://www.salud.gov.pr/Pages/coronavirus.aspx</a>) y está sujeta a cambio y/o clarificación.</div>
          <div style={{fontSize: 13,margin:10}}>&copy; 2020 <a href="https://github.com/williamrodz/covid19-puertorico-web/blob/master/LICENSE.txt">Licencia</a></div>
          <div style={{fontSize: 13,margin:20,}}> Hecho con <span style={{color: '#e25555'}}>&#9829;</span> por <a href="https://twitter.com/williamrodz" target="_blank" rel="noopener noreferrer" onClick={(event) => {event.preventDefault(); window.open("https://twitter.com/williamrodz");}}>William Rodríguez Jiménez</a></div>
        </div>

      </div>
    );

}
