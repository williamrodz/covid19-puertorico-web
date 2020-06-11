import React, {useState,useEffect} from 'react';
import { Button, Alert,Modal,Navbar,Nav,Dropdown} from 'react-bootstrap';
import LineChart from '../LineChart';
import Tableau from '../Tableau'
import { CSVLink } from "react-csv";
import * as Icon from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';
import logo from '../../logo192.png'; // Tell webpack this JS file uses this image
import { PieChart } from 'react-minimal-pie-chart';


import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";

const ALERT_HEADER = {'en-us':'New look (6/05/20)','es-pr':'Nuevo \'look\' (5-junio-20)'}
const ALERT_BODY_ES =
(<p> Se ha rediseñado la interfaz de las estadísticas claves con gráficas circulares.
</p>)
const ALERT_BODY_EN =
(<p>  The site has gotten a face lift, with a new look for visualizing key statistics and pie charts.
</p>)

const ALERT_BODY = {'en-us':ALERT_BODY_EN,'es-pr':ALERT_BODY_ES}

const MONTHS_ES = {1:"enero",2:"febrero",3:"marzo",4:"abril",5:"mayo",6:"junio",7:"julio",8:"agosto",9:"septiembre",10:"octubre",11:"noviembre",12:"diciembre"}
const MONTHS_EN = {1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9 : "September", 10: "October", 11: "November", 12: "December"}
const MONTHS = {'en-us':MONTHS_EN,'es-pr':MONTHS_ES}

const LABELS_ES = {confirmedCases:"Casos positivos únicos",molecularTests:"Prueba molecular",serologicalTests:"Prueba serológica",deaths:"Muertes",
                  percentInfected:"Porciento de puertorriqueños infectados",fatalityRate:"Tasa de muertes",date:"Fecha",
                  confirmedCasesExplanation:"Es el número de casos positivos atribuidos a una sola persona. Antes del 5 de mayo del 2020, el Departmento de Salúd publicaba el número de pruebas positivas que no necesariamente correspondía al número de personas que probaron positivo al COVID-19.",
                  molecularTestsExplanation:"Éste es el número de casos positivos del COVID-19 de acuerdo a pruebas moleculares. Éstas detectan directamente el ARN (ácido ribonucleico), es decir, el material genético del virus, en las muestras tomadas de secreciones respiratorias del paciente.",
                  serologicalTestsExplanation:"Este dato representa el número de casos positivos del COVID-19 de acuerdo a pruebas serólogicas. La prueba serológica detecta nuestra respuesta inmunológica contra el patógeno. Éstas son referidas como \"pruebas rápidas\", pues ofrecen resultados en 10 minutos.",
                  deathsExplanation:"Este número representa el número de muertes atribuídas a COVID-19 en Puerto Rico.",
                  percentInfectedExplanation:"Este número representa el número de casos positivos dividido entre 3.194 millón (cifra de población de Puerto Rico).",
                  fatalityRateExplanation:"Este número representa el número de muertes atribuidas al COVID-19 dividido entre los casos positivos únicos.",
                  today:'hoy', change:"Cambio",
                  inPuertoRico:" en Puerto Rico",
                  last7daysText:'Últimos 7 días',
                  last14daysText:'Últimos 14 días',
                  last30daysText:'Últimos 30 días',
                  last0daysText:"Desde el comienzo",
                  timeRangeSelectionText:'Rango de tiempo',
                  excessDeathsTableTitle:"Ilustración del exceso de muertes semanal",
                  excessDeathsTableDescription:"El CDC produjo la siguiente visualización que ilustra el número de muertes semanales que se espera (en azúl) en comparación con el número actual. Si hay más muertes que lo anticipado, el número actual sobrepasará la curva amarilla y conllevará un signo rojo de más (+). Puede comparar esta visualización con otras jurisdicciones de EEUU bajo \"Select a jurisdiction\".",
                  testDistribution:"Distribución de pruebas",
                  serological:"Serológica",
                  }
const LABELS_EN = {confirmedCases:"Unique positive cases",molecularTests:"Molecular Tests",serologicalTests:"Serological Tests",deaths:"Deaths",
                  percentInfected:"Percent of PR population infected ",fatalityRate:"Fatality rate",date:"Date",
                  confirmedCasesExplanation: "This is the number of positive cases attributed to a single person. Before May 5, 2020, the PR Department of Health published the number of positive tests that did not necessarily correspond to the number of people who tested positive for COVID-19. (e.g multiple tests per person)" ,
                  molecularTestsExplanation: "This is the number of positive cases of COVID-19 according to molecular tests. These directly detect RNA (ribonucleic acid), the genetic material of the virus, in samples taken from the patient's respiratory secretions." ,
                  serologicalTestsExplanation: "This data represents the number of positive cases of COVID-19 according to serological tests. The serological test detects our immune response against the pathogen. These are referred to as \"quick tests\", as they offer results in 10 minutes. ",
                  deathsExplanation: "This represents the number of deaths attributed to COVID-19 in Puerto Rico.",
                  percentInfectedExplanation:"This number represents the number of positive cases divided by 3.194 million (our figure of for the current population of Puerto Rico).",
                  fatalityRateExplanation:"This number represents the percentage of deaths attributed to COVID-19 over the number of unique positive cases.",
                  today:'today',change:"Change",
                  inPuertoRico:" in Puerto Rico",
                  last7daysText:'Last 7 days',
                  last14daysText:'Last 14 days',
                  last30daysText:'Last 30 days',
                  last0daysText:"From the beginning",
                  timeRangeSelectionText:'Time range',
                  excessDeathsTableTitle:"Visualize weekly excess deaths ",
                  excessDeathsTableDescription:"",
                  testDistribution:"Test distribution",
                  serological:"Serological"}



const LABELS = {'en-us':LABELS_EN,'es-pr':LABELS_ES}
const GRAPHING_DESCRIPTION_ES = {instructions:"Qué graficar:",dataPerDay:"Data por día",changePerDay:"Cambio por día"}
const GRAPHING_DESCRIPTION_EN = {instructions:"What to graph:",dataPerDay:"Data per day",changePerDay:"Change per day"}
const GRAPHING_DESCRIPTION = {'en-us':GRAPHING_DESCRIPTION_EN,'es-pr':GRAPHING_DESCRIPTION_ES}

const DISCLAIMER_ES = (<div>*La data provista fue obtenida del sitio web del Departamento de Salúd del coronavirus (<a href="http://www.salud.gov.pr/Pages/coronavirus.aspx" target="_blank" rel="noopener noreferrer">http://www.salud.gov.pr/Pages/coronavirus.aspx</a>) y está sujeta a cambio y/o clarificación.</div>)
const DISCLAIMER_EN = (<div>*The provided data was obtained from the Puerto Rico Department of Health's coronavirus website(<a href="http://www.salud.gov.pr/Pages/coronavirus.aspx" target="_blank" rel="noopener noreferrer">http://www.salud.gov.pr/Pages/coronavirus.aspx</a>) and is subject to change and/or clarification</div>)
const DISCLAIMER_DIV = {'en-us':DISCLAIMER_EN,'es-pr':DISCLAIMER_ES}

const ATTRIBUTES = ["serologicalTests","confirmedCases","molecularTests",'testsInProgress',"deaths"]
const ATTRIBUTE_CLASS_ORDER= ['primary','warning','success','secondary','danger']


const BOOTSTRAP_BUTTON_CLASSES_TO_COLORS = {'warning':'rgb(255, 193, 7)','primary':'rgb(0, 123, 255)','success':'rgb(40, 167, 69)','secondary':'rgb(108, 117, 125)','danger':'rgb(220, 53, 69)',}

// const ATTRIBUTES_TO_CLASSES =
var ATTRIBUTES_TO_CLASSES = []
ATTRIBUTES.forEach((item, i) => {
  ATTRIBUTES_TO_CLASSES[item] = ATTRIBUTE_CLASS_ORDER[i]
});

const DELTA_LINE_COLOR = 'purple'

// eslint-disable-next-line
const PR_POPULATION = 3.194*(10**6)


function anglifySaludTimeSignature(saludTimeSignature){
  const currentMonth = (new Date ()).getMonth() + 1
  const currentMonthEN = MONTHS_EN[currentMonth]

  var anglified = saludTimeSignature.trim()
  anglified = anglified.replace(/\s/g,"_")

  var splitUp = anglified.split("_")
  var dayNumber = splitUp[2]
  var year = splitUp[6].replace(",","")
  var time = splitUp[7]
  var ampm = splitUp[8].replace(")","")



  return `Updated ${currentMonthEN} ${dayNumber}, ${year}, ${time} ${ampm}`

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

function Navigation(props){
  return (
    <div style={{width: "100%"}}>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand href="#home" style={{fontSize: "20px"}}><Logo inPuertoRico={props.inPuertoRico}/></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <div style={{display: 'flex',flexDirection: 'row'}}>
              <FacebookButton/>
              <TwitterButton/>
            </div>


          </Nav>
          <Nav style={{fontSize: "15px"}}>
            <Nav.Link eventKey={2} onClick={()=>props.clickSpanishButton()}>Español</Nav.Link>
            <Nav.Link eventKey={1} onClick={()=>props.clickEnglishButton()}>
              English
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}


const Logo = (props) =>{

  return (
    <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
      <img src={logo} alt="Logo" width='54px' title="Logo COVID Tracker PR &copy; Lissette Rodríguez "/>
      <div style={{color: 'yellow',fontWeight: 'bold'}}>COVID-19</div>
      <div style={{marginLeft: 5}}>{props.inPuertoRico}</div>
    </div>
  )
}




function getFigureWithTodaysCount(color,label,figure,saludTimeSignature,newToday,locale){
  var number = formatInteger(figure)

  const locationOfAl = saludTimeSignature.indexOf("al ")
  const dateNumberStart = locationOfAl + 3
  const dateNumberEnd = saludTimeSignature[dateNumberStart+1] === " " ? dateNumberStart+1 : dateNumberStart+2


  const saludDayOfMonth = parseInt(saludTimeSignature.substring(dateNumberStart,dateNumberEnd))
  const todaysDayOfMonth = (new Date()).getDate()

  const dateFromToday = saludDayOfMonth === todaysDayOfMonth


  if (dateFromToday){
    return (<div style={{display:'flex',flexDirection:'column'}}>
              <text style={{fontSize: 45,fontWeight: 'bold',color:color}}>{number}</text>
              <text>{`(+${formatInteger(newToday)}`} { `${LABELS[locale].today})`}</text>
              <text style={{color: 'grey'}}>{label}</text>
            </div>)
  } else{
    return (<div style={{display:'flex',flexDirection:'column'}}>
              <text style={{fontSize: 45,fontWeight: 'bold',color:color}}>{number}</text>
              <text style={{color: 'grey'}}>{label}</text>
            </div>)
  }
}

function createDataObject(data,UIstate){

  let xKey = 'timestamp'
  let yKey = `${UIstate.attributeToGraph}`
  let graphOptionAbsolute = UIstate.graphOptionAbsolute
  let graphOptionChange = UIstate.graphOptionChange
  let locale = UIstate.locale

  let today = new Date()
  let lowerTimeBound =  today.setDate(today.getDate()-UIstate.graphLastXdays);


  var formattedData = []
  var formattedDeltaData = []
  for (var i = 0; i < data.length; i++) {
    const entry = data[i]
    var xShorthand = entry[xKey]
    if (xKey === "timestamp"){
      const dateObj = new Date(entry[xKey])
      if (UIstate.graphLastXdays !== 0 && dateObj < lowerTimeBound){
        continue
      }

      xShorthand = UIstate.locale === "es-pr" ? `${dateObj.getDate()}-${MONTHS[locale][dateObj.getMonth()+1]}` : `${MONTHS[locale][dateObj.getMonth()+1]}-${dateObj.getDate()}`
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

  const dataObject = {
  "id": LABELS[UIstate.locale][UIstate.attributeToGraph],
  "color":BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES[yKey]],
  "data": formattedData}

  const deltaObject = {
  "id": LABELS[UIstate.locale].change,
  "color":DELTA_LINE_COLOR,
  "data": formattedDeltaData}
  // console.log("formattedData",formattedData)
  // console.log("formattedDeltaData",formattedDeltaData)

  var dataList = []
  if (graphOptionAbsolute){
    dataList.push(dataObject)
  }

  if (graphOptionChange){
    dataList.push(deltaObject)
  }

  return dataList
}


const FacebookButton = (props)=>{
  return(
  <FacebookShareButton url="covidtrackerpr.com">
    <FacebookIcon size={'35px'} round={true}/>
  </FacebookShareButton>
  )
}

const TwitterButton = (props)=>{
  return(
  <a href="https://twitter.com/intent/tweet?text=Visualiza%20la%20curva%20de%20COVID-19%20en%20Puerto%20Rico%3A&url=http%3A%2F%2Fcovidtrackerpr.com">
    <TwitterIcon size={'35px'} round={true}/>
  </a>
  )
}

const AlertHeader = (props) =>
   (
  <Alert style={{width: "80%"}}variant="primary" onClose={props.onClose} dismissible>
         <Alert.Heading>{props.header}</Alert.Heading>
         {props.body}
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

const MainDataBlock = (props) =>{
  for (var i = 0; i < props.length; i++) {
    console.log("prop",props[i])
  }


  return (
    <div className="statsBlock">
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].confirmedCases,modalBody:LABELS[UIstate.locale].confirmedCasesExplanation})"} className="infoCircle"/>
          {getFigureWithTodaysCount("#fdcb6e",props.confirmedCasesLabel,props.confirmedCases,props.saludTimeSignature,props.newCasesToday,props.locale)}
        </div>
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].deaths,modalBody:LABELS[UIstate.locale].deathsExplanation})"} className="infoCircle"/>
          {getFigureWithTodaysCount("red",props.deathsLabel,props.deaths,props.saludTimeSignature,props.newDeathsToday,props.locale)}
        </div>
    </div>
  )
}

const TestsNumbersBlock = (props) =>{
  for (var i = 0; i < props.length; i++) {
    console.log("prop",props[i])
  }

  return (
    <div className="statsBlock">
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].serologicalTests,modalBody:LABELS[UIstate.locale].serologicalTestsExplanation})"} className="infoCircle"/>
          {getFigureWithTodaysCount("#a29bfe",props.serologicalTestsLabel,props.serologicalTests,props.saludTimeSignature,props.newSerologicalTestsToday,props.locale)}
        </div>
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].molecularTests,modalBody:LABELS[UIstate.locale].molecularTestsExplanation})"} className="infoCircle"/>
          {getFigureWithTodaysCount("#a29bfe",props.molecularTestsLabel,props.molecularTests,props.saludTimeSignature,props.newMolecularTestsToday,props.locale)}
        </div>
    </div>
  )
}

const TimeRangeSelector = (props) =>{

return (
  <>
    <div>
      {props.timeRangeSelectionText}:
    </div>
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        {props[`last${props.graphLastXdays}daysText`]}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(7)}>{props.last7daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(14)}>{props.last14daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(30)}>{props.last30daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(0)}>{props.last0daysText}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </>
  )
}



const TestDistributionChart = (props) =>{

  return (
        <div className="statsBlock" style={{borderColor:"#cbd5e0", borderStyle: 'solid',borderWidth: "1px",borderRadius: 15,display: 'flex',flexDirection: 'row',alignItems: 'center', minWidth: "410px"}}>
          <PieChart
            startAngle={-90}
            data={[
              { title: props.molecular, value:props.molecularTests, color: '#8e44ad' },
              { title: props.serological, value:props.serologicalTests , color: '#2980b9' },

            ]}
            totalValue={props.molecularTests+props.serologicalTests}

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
          <text style={{textAlign:'center',fontSize: 20,fontWeight: 'bold',marginRight: "18px"}}>{props.description}</text>

        </div>
  )
}

const FatalityRateChart = (props) =>{

  return (
    <div className="statsBlock" style={{borderStyle: 'solid',borderColor: "#cbd5e0",borderWidth: "1px",borderRadius: 15,display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
      <PieChart
        data={[
          { title: 'Casos positivos resultando en muertes', value: parseInt(props.deaths*100/props.confirmedCases), color: 'red' },
          { title: 'Casos positivos sobrevientes', value: 100-parseInt(props.deaths*100/props.confirmedCases), color: '#ecf0f1' }

        ]}
        totalValue={100}

        animate={true}
        lineWidth={30} // Adjusts "donut" width
        label={({ dataEntry }) => getPercent(props.deaths,props.confirmedCases,2)}
        labelStyle={{
          fontSize: '20px',
          fontFamily: 'sans-serif',
          fill: 'red',
        }}
        labelPosition={0}
        style={{height: "140px"}}


      />
      <text style={{textAlign:'center',fontSize: 20,fontWeight: 'bold',marginRight: "18px"}}>{props.description}</text>

    </div>
  )
}

const CoffeeButton = (props) =>{
  return (
    <a href="https://buymeacoff.ee/williama">
      <div id="bmc-wbtn"
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center',width: "64px",height: "64px", background: 'rgb(255, 129, 63)',color: "white",borderRadius: "32px", position: 'fixed', left: "18px", bottom: "18px",boxShadow: "rgba(0, 0, 0, 0.4) 0px 4px 8px",zIndex: 999,cursor: 'pointer', fontWeight: 600, transition: "all 0.2s ease 0s", transform: 'scale(1)'}}>
          <img src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg" alt="Buy Me A Coffee" style={{height: "40px", width: "40px", margin: 0, padding: 0}}/>
      </div>
    </a>
  )
}

const LoveStatement = (props) =>{
  const madeWith = props.locale === "es-pr" ? "Hecho con " : "Made with "
  const by = props.locale === "es-pr" ? "por" : "by"
  return (
    <div>
    {madeWith}<span style={{color: '#e25555'}}>&#9829;</span> {by} <a href="https://twitter.com/williamrodz" target="_blank" rel="noopener noreferrer" onClick={(event) => {event.preventDefault(); window.open("https://twitter.com/williamrodz");}}>William Rodríguez Jiménez</a>
    </div>
  )
}

export default function Home(props) {

    const [cookie, setCookie] = useCookies();
    // console.log("cookie",cookie)

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
                locale:'es-pr',
                graphLastXdays:14,
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
// eslint-disable-next-line
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

    const dataObjectForChart = createDataObject(historicalData.all,UIstate)
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

  const saveNewLocale = (newLocale) =>{
    setUIState({...UIstate,locale:newLocale})
    setCookie("ui",{...UIstate,locale:newLocale})

  }
  const chooseTimeRange = (days) =>{
    setUIState({...UIstate,graphLastXdays:days})
  }



    const dataObjectForChart = createDataObject(historicalData.all,UIstate)

    return (
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',backgroundColor: 'white'}}>
        <Navigation inPuertoRico={LABELS[UIstate.locale].inPuertoRico} clickEnglishButton={()=>saveNewLocale('en-us')} clickSpanishButton={()=>saveNewLocale('es-pr')}/>
        <div style={{display:'flex',flexDirection:'column',marginTop: 20,alignItems: 'center'}}>
          <InfoModal modalVisible={UIstate.modalVisible} modalHeader={UIstate.modalHeader} modalBody={UIstate.modalBody} handleShow={()=>setUIState({...UIstate,modalVisible:true})} handleClose={()=>setUIState({...UIstate,modalVisible:false})}/>
        </div>


        {UIstate.alertVisible ? <AlertHeader onClose={closeAlert} header={ALERT_HEADER[UIstate.locale]} body={ALERT_BODY[UIstate.locale]}/> : <div/>}
        <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',margin:20}}>
          <div className="statsRow">
            <MainDataBlock
              confirmedCases={today.confirmedCases} newCasesToday={historicalData.newCasesToday} confirmedCasesLabel={LABELS[UIstate.locale].confirmedCases}
              molecularTests={today.molecularTests} newMolecularTestsToday={historicalData.newMolecularTestsToday} molecularTestsLabel={LABELS[UIstate.locale].molecularTests}
              serologicalTests={today.serologicalTests} newSerologicalTestsToday={historicalData.newSerologicalTestsToday} serologicalTestsLabel={LABELS[UIstate.locale].serologicalTests}
              deaths={today.deaths} newDeathsToday={historicalData.newDeathsToday} deathsLabel={LABELS[UIstate.locale].deaths}
              saludTimeSignature={today.saludTimeSignature}
              locale={UIstate.locale}
              />
            <FatalityRateChart deaths={today.deaths} confirmedCases={today.confirmedCases} description={LABELS[UIstate.locale].fatalityRate}/>
          </div>
          <div className="statsRow">
            <TestsNumbersBlock
              confirmedCases={today.confirmedCases} newCasesToday={historicalData.newCasesToday} confirmedCasesLabel={LABELS[UIstate.locale].confirmedCases}
              molecularTests={today.molecularTests} newMolecularTestsToday={historicalData.newMolecularTestsToday} molecularTestsLabel={LABELS[UIstate.locale].molecularTests}
              serologicalTests={today.serologicalTests} newSerologicalTestsToday={historicalData.newSerologicalTestsToday} serologicalTestsLabel={LABELS[UIstate.locale].serologicalTests}
              deaths={today.deaths} newDeathsToday={historicalData.newDeathsToday} deathsLabel={LABELS[UIstate.locale].deaths}
              saludTimeSignature={today.saludTimeSignature}
              locale={UIstate.locale}
              />
            <TestDistributionChart molecularTests={today.molecularTests} serologicalTests={today.serologicalTests} description={LABELS[UIstate.locale].testDistribution}
                                    molecular="Molecular" serological={LABELS[UIstate.locale].serological}/>
          </div>
        </div>

        <div style={{textAlign:'center',marginTop: 10}}>{GRAPHING_DESCRIPTION[UIstate.locale].instructions}</div>
        <div style={{display:'flex',flexDirection:'row'}}>
          <Button onClick={()=>toggleGraphOption('absolute')} variant={UIstate.graphOptionAbsolute ? 'primary' : 'light'}>{GRAPHING_DESCRIPTION[UIstate.locale].dataPerDay}</Button>{' '}
          <Button onClick={()=>toggleGraphOption('change')} variant={UIstate.graphOptionChange ? 'primary' : 'light'}>{GRAPHING_DESCRIPTION[UIstate.locale].changePerDay}</Button>{' '}
        </div>
        <TimeRangeSelector graphLastXdays={UIstate.graphLastXdays}
          last0daysText={LABELS[UIstate.locale]['last0daysText']}
          last7daysText={LABELS[UIstate.locale]['last7daysText']}
          last14daysText={LABELS[UIstate.locale]['last14daysText']}
          last30daysText={LABELS[UIstate.locale]['last30daysText']}
          timeRangeSelectionText={LABELS[UIstate.locale]['timeRangeSelectionText']}
          timeRangeSelectionFunction={chooseTimeRange}


          />


        <div className="attributeToGraphSelection">
          <Button onClick={()=>chooseButton('confirmedCases')} variant={UIstate.confirmedCasesButtonVariant}>{LABELS[UIstate.locale].confirmedCases}</Button>{' '}
          <Button onClick={()=>chooseButton('serologicalTests')} variant={UIstate.serologicalTestsButtonVariant}>{LABELS[UIstate.locale].serologicalTests}</Button>{' '}
          <Button onClick={()=>chooseButton('molecularTests')} variant={UIstate.molecularTestsButtonVariant}>{LABELS[UIstate.locale].molecularTests}</Button>{' '}
          <Button onClick={()=>chooseButton('deaths')} variant={UIstate.deathsButtonVariant}>{LABELS[UIstate.locale].deaths}</Button>{' '}
        </div>

        <div className="chartContainer">
          <LineChart data={dataObjectForChart} xAxisLabel={LABELS[UIstate.locale].date} yAxisLabel={LABELS[UIstate.locale][UIstate.attributeToGraph]} graphColors={UIstate.graphColors}/>
        </div>
        <div style={{display:'flex',flexDirection:'row',textAlign: 'center',margin: 5}}>
          <div>{UIstate.locale === 'es-pr' ? today.saludTimeSignature : anglifySaludTimeSignature(today.saludTimeSignature)}</div>
        </div>
        <div style={{margin: 5,marginBottom: 20,display: 'flex',flexDirection: 'column',textAlign: 'center'}}>
          <CSVLink data={getDataForDownload()} filename={`${UIstate.attributeToGraph}${removeParentheses(today.saludTimeSignature)}.csv`}>
            <Button variant="success">{UIstate.locale === 'es-pr' ? 'Bajar data ' : "Download data "}<Icon.Download /></Button>
          </CSVLink>
          <div style={{fontSize: 13}}>{DISCLAIMER_DIV[UIstate.locale]}</div>
        </div>
        <Tableau title={LABELS[UIstate.locale].excessDeathsTableTitle} description={LABELS[UIstate.locale].excessDeathsTableDescription}/>
        <div style={{display: 'flex',flexDirection: 'column',height: "10vh",alignItems: 'center',textAlign: 'center',marginBottom: 40}}>
          <div style={{fontSize: 13,margin:10}}>&copy; 2020 <a href="https://github.com/williamrodz/covid19-puertorico-web/blob/master/LICENSE.txt">{UIstate.locale === 'es-pr' ? 'Licencia' : 'License'}</a></div>
          <LoveStatement style={{fontSize: 13,marginTop: 10}} locale={UIstate.locale}/>
          <CoffeeButton/>
        </div>

      </div>
    );

}
