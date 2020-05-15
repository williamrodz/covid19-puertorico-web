import React, {useState,useEffect} from 'react';
import { Button, Alert,Modal,NavDropdown,Navbar,Nav,} from 'react-bootstrap';
import LineChart from '../LineChart';
import { CSVLink } from "react-csv";
import * as Icon from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';

const ALERT_HEADER = {'en-us':'Change of available information','es-pr':'Cambio de datos disponibles'}
const ALERT_BODY_ES =
(<p>(1) Hubo un lapso de tiempo entre el 23 de abril y el 5 de mayo 2020 en lo cual el Departmento de Salúd no publicó data en su sitio web del coronavirus.<br/>
(2) Desde el 5 de mayo del 2020, el Departmento de Salúd sólo publica el número de casos positivos únicos (a diferencia de número de pruebas positivos totales),
pruebas moleculares, pruebas serológicas y muertes en su página oficial. Seguiremos manteniendo el historial
de los números de pruebas realizadas, casos negativos y pruebas en procesamiento hasta la fecha del 23 de abril, que fue el último día en cual se ofrecieron estos datos.
</p>)
const ALERT_BODY_EN =
(<p>(1) There was a lapse of time between April 23 and May 5, 2020 in which the Health Department did not publish data on its coronavirus website.<br/>
(2) As of May 5, 2020, the Health Department only publishes the number of unique positive cases (as opposed to the number of total positive tests), molecular tests, serological tests and deaths on its official website. We will continue to keep track of the numbers of tests performed, negative cases and tests in process until the date of April 23, which was the last day that this data was offered.
</p>)

const ALERT_BODY = {'en-us':ALERT_BODY_EN,'es-pr':ALERT_BODY_ES}

const MONTHS_ES = {1:"enero",2:"febrero",3:"marzo",4:"abril",5:"mayo",6:"junio",7:"julio",8:"agosto",9:"septiembre",10:"octubre",11:"noviembre",12:"diciembre"}
const MONTHS_EN = {1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9 : "September", 10: "October", 11: "November", 12: "December"}
const MONTHS = {'en-us':MONTHS_EN,'es-pr':MONTHS_ES}

const LABELS_ES = {confirmedCases:"Casos positivos únicos",molecularTests:"Prueba molecular",serologicalTests:"Prueba serológica",deaths:"Muertes",
                  percentInfected:"Porciento de puertorriqueños infectados",deathRate:"Porciento de muertes",date:"Fecha",
                  confirmedCasesExplanation:"Es el número de casos positivos atribuidos a una sola persona. Antes del 5 de mayo del 2020, el Departmento de Salúd publicaba el número de pruebas positivas que no necesariamente correspondía al número de personas que probaron positivo al COVID-19.",
                  molecularTestsExplanation:"Éste es el número de casos positivos del COVID-19 de acuerdo a pruebas moleculares. Éstas detectan directamente el ARN (ácido ribonucleico), es decir, el material genético del virus, en las muestras tomadas de secreciones respiratorias del paciente.",
                  serologicalTestsExplanation:"Este dato representa el número de casos positivos del COVID-19 de acuerdo a pruebas serólogicas. La prueba serológica detecta nuestra respuesta inmunológica contra el patógeno. Éstas son referidas como \"pruebas rápidas\", pues ofrecen resultados en 10 minutos.",
                  deathsExplanation:"Este número representa el número de muertes atribuídas a COVID-19 en Puerto Rico.",
                  percentInfectedExplanation:"Este número representa el número de casos positivos dividido entre 3.194 millón (cifra de población de Puerto Rico).",
                  deathRateExplanation:"Este número representa el número de muertes atribuidas al COVID-19 dividido entre los casos positivos únicos.",
                  today:'hoy', change:"Cambio",
                  navbarTitle:"COVID-19 en Puerto Rico",}
const LABELS_EN = {confirmedCases:"Unique positive cases",molecularTests:"Molecular Tests",serologicalTests:"Serological Tests",deaths:"Deaths",
                  percentInfected:"Percent of PR population infected ",deathRate:"Death rate",date:"Date",
                  confirmedCasesExplanation: "This is the number of positive cases attributed to a single person. Before May 5, 2020, the PR Department of Health published the number of positive tests that did not necessarily correspond to the number of people who tested positive for COVID-19. (e.g multiple tests per person)" ,
                  molecularTestsExplanation: "This is the number of positive cases of COVID-19 according to molecular tests. These directly detect RNA (ribonucleic acid), the genetic material of the virus, in samples taken from the patient's respiratory secretions." ,
                  serologicalTestsExplanation: "This data represents the number of positive cases of COVID-19 according to serological tests. The serological test detects our immune response against the pathogen. These are referred to as \"quick tests\", as they offer results in 10 minutes. ",
                  deathsExplanation: "This represents the number of deaths attributed to COVID-19 in Puerto Rico.",
                  percentInfectedExplanation:"This number represents the number of positive cases divided by 3.194 million (our figure of for the current population of Puerto Rico).",
                  deathRateExplanation:"This number represents the percentage of deaths attributed to COVID-19 over the number of unique positive cases.",
                  today:'today',change:"Change",
                  navbarTitle:"COVID-19 in Puerto Rico"}


const LABELS = {'en-us':LABELS_EN,'es-pr':LABELS_ES}
const GRAPHING_DESCRIPTION_ES = {instructions:"Qué graficar:",dataPerDay:"Data por día",changePerDay:"Cambio por día"}
const GRAPHING_DESCRIPTION_EN = {instructions:"What to graph:",dataPerDay:"Data per day",changePerDay:"Change per day"}
const GRAPHING_DESCRIPTION = {'en-us':GRAPHING_DESCRIPTION_EN,'es-pr':GRAPHING_DESCRIPTION_ES}

const DISCLAIMER_ES = (<div>*La data provista fue obtenida del sitio web del Departamento de Salúd del coronavirus (<a href="http://www.salud.gov.pr/Pages/coronavirus.aspx" target="_blank" rel="noopener noreferrer">http://www.salud.gov.pr/Pages/coronavirus.aspx</a>) y está sujeta a cambio y/o clarificación.</div>)
const DISCLAIMER_EN = (<div>*The provided data was obtained from the Puerto Rico Department of Health's coronavirus website(<a href="http://www.salud.gov.pr/Pages/coronavirus.aspx" target="_blank" rel="noopener noreferrer">http://www.salud.gov.pr/Pages/coronavirus.aspx</a>) and is subject to change and/or clarification</div>)
const DISCLAIMER_DIV = {'en-us':DISCLAIMER_EN,'es-pr':DISCLAIMER_ES}

const ATTRIBUTES = ["conductedTests","confirmedCases","negativeCases",'testsInProgress',"deaths"]
const ATTRIBUTE_CLASS_ORDER= ['primary','warning','success','secondary','danger']


const BOOTSTRAP_BUTTON_CLASSES_TO_COLORS = {'warning':'rgb(255, 193, 7)','primary':'rgb(0, 123, 255)','success':'rgb(40, 167, 69)','secondary':'rgb(108, 117, 125)','danger':'rgb(220, 53, 69)',}

// const ATTRIBUTES_TO_CLASSES =
var ATTRIBUTES_TO_CLASSES = []
ATTRIBUTES.forEach((item, i) => {
  ATTRIBUTES_TO_CLASSES[item] = ATTRIBUTE_CLASS_ORDER[i]
});

const DELTA_LINE_COLOR = 'purple'

const PR_POPULATION = 3.194*(10**6)


function anglifySaludTimeSignature(saludTimeSignature){
  const currentMonth = (new Date ()).getMonth() + 1
  const currentMonthES = MONTHS_ES[currentMonth]
  const currentMonthEN = MONTHS_EN[currentMonth]

  var anglified = saludTimeSignature.replace("Datos al","Updated")
  anglified = anglified.replace("de",currentMonthEN)
  anglified = anglified.replace(`${currentMonthES}`,'')
  anglified = anglified.replace("de ","")

  return anglified

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
        <Navbar.Brand href="#home">{props.navbarTitle}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
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


function getFigureWithTodaysCount(confirmedCases,saludTimeSignature,newCasesToday,locale){
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
              <div>{`(+${formatInteger(newCasesToday)}`} {window.innerWidth > 767 ? `${LABELS[locale].today})` : ')'}</div>
            </div>)
  } else{
    return text
  }
}

function createDataObject(data,UIstate){

  let xKey = 'timestamp'
  let yKey = `${UIstate.attributeToGraph}`
  let graphOptionAbsolute = UIstate.graphOptionAbsolute
  let graphOptionChange = UIstate.graphOptionChange
  let locale = UIstate.locale



  var formattedData = []
  var formattedDeltaData = []
  for (var i = 0; i < data.length; i++) {
    const entry = data[i]
    var xShorthand = entry[xKey]
    if (xKey === "timestamp"){
      const dateObj = new Date(entry[xKey])
      xShorthand = `${dateObj.getDate()}-${MONTHS[locale][dateObj.getMonth()+1]}`
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
                locale:'es-pr'
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



    const dataObjectForChart = createDataObject(historicalData.all,UIstate)

    return (
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',backgroundColor: 'white'}}>
        <Navigation navbarTitle={LABELS[UIstate.locale].navbarTitle} clickEnglishButton={()=>saveNewLocale('en-us')} clickSpanishButton={()=>saveNewLocale('es-pr')}/>
        <div style={{display:'flex',flexDirection:'column',marginTop: 20,alignItems: 'center'}}>
          <InfoModal modalVisible={UIstate.modalVisible} modalHeader={UIstate.modalHeader} modalBody={UIstate.modalBody} handleShow={()=>setUIState({...UIstate,modalVisible:true})} handleClose={()=>setUIState({...UIstate,modalVisible:false})}/>
        </div>
        {UIstate.alertVisible ? <AlertHeader onClose={closeAlert} header={ALERT_HEADER[UIstate.locale]} body={ALERT_BODY[UIstate.locale]}/> : <div/>}
        <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',margin:20}}>
          <div style={{display: 'flex',flexDirection: 'column'}}>

            <div style={{display: 'flex',flexDirection: 'column'}}>
              <div style={{display:'flex',flexDirection:'row'}}>
                <DataBlock blockType="label" text={LABELS[UIstate.locale].confirmedCases} borderTopLeftRadius={15}
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].confirmedCases,modalBody:LABELS[UIstate.locale].confirmedCasesExplanation})}/>

                <DataBlock blockType="label" text={LABELS[UIstate.locale].molecularTests}
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].molecularTests,modalBody:LABELS[UIstate.locale].molecularTestsExplanation})}/>

                <DataBlock blockType="label" text={LABELS[UIstate.locale].serologicalTests}
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].serologicalTests,modalBody:LABELS[UIstate.locale].serologicalTestsExplanation})}/>

                <DataBlock blockType="label" text={LABELS[UIstate.locale].deaths} borderTopRightRadius={15}
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].deaths,modalBody:LABELS[UIstate.locale].deathsExplanation})}/>


              </div>
              <div style={{display:'flex',flexDirection:'row'}}>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(today.confirmedCases,today.saludTimeSignature,historicalData.newCasesToday,UIstate.locale)} borderBottomLeftRadius={15}/>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(today.molecularTests,today.saludTimeSignature,historicalData.newMolecularTestsToday,UIstate.locale)}/>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(today.serologicalTests,today.saludTimeSignature,historicalData.newSerologicalTestsToday,UIstate.locale)}/>
                <DataBlock blockType="data" text={getFigureWithTodaysCount(today.deaths,today.saludTimeSignature,historicalData.newDeathsToday,UIstate.locale)} borderBottomRightRadius={15} />
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
                <DataBlock blockType="label" text={LABELS[UIstate.locale].percentInfected} borderTopLeftRadius={15} fontSize="2.5vh"
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].percentInfected,modalBody:LABELS[UIstate.locale].percentInfectedExplanation})}/>

                <DataBlock blockType="label" text={LABELS[UIstate.locale].deathRate} borderTopRightRadius={15}
                  infoClick={()=>setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].deathRate,modalBody:LABELS[UIstate.locale].deathRateExplanation})}/>


              </div>

              <div style={{display:'flex',flexDirection:'row'}}>
                <DataBlock blockType="data" text={PR_POPULATION ? getPercent(today.confirmedCases,PR_POPULATION,3) : 0} borderBottomLeftRadius={15}/>
                <DataBlock blockType="data" text={today.confirmedCases !== 0 ? getPercent(today.deaths,today.confirmedCases,2) : 0} borderBottomRightRadius={15}/>


              </div>
            </div>

          </div>
        </div>

        <div style={{textAlign:'center',marginTop: 10}}>{GRAPHING_DESCRIPTION[UIstate.locale].instructions}</div>
        <div style={{display:'flex',flexDirection:'row'}}>
          <Button onClick={()=>toggleGraphOption('absolute')} variant={UIstate.graphOptionAbsolute ? 'primary' : 'light'}>{GRAPHING_DESCRIPTION[UIstate.locale].dataPerDay}</Button>{' '}
          <Button onClick={()=>toggleGraphOption('change')} variant={UIstate.graphOptionChange ? 'primary' : 'light'}>{GRAPHING_DESCRIPTION[UIstate.locale].changePerDay}</Button>{' '}
        </div>
        <div className="attributeToGraphSelection">
          <Button onClick={()=>chooseButton('confirmedCases')} variant={UIstate.confirmedCasesButtonVariant}>{LABELS[UIstate.locale].confirmedCases}</Button>{' '}
          <Button onClick={()=>chooseButton('conductedTests')} variant={UIstate.conductedTestsButtonVariant}>{UIstate.locale === 'es-pr'? 'Pruebas administradas':'Administered tests'}</Button>{' '}
          <Button onClick={()=>chooseButton('negativeCases')} variant={UIstate.negativeCasesButtonVariant}>{UIstate.locale === 'es-pr'? 'Casos negativos' : 'Negative cases'}</Button>{' '}
          <Button onClick={()=>chooseButton('testsInProgress')} variant={UIstate.testsInProgressButtonVariant}>{UIstate.locale === 'es-pr'? 'Pruebas en proceso' : 'Tests in progress'}</Button>{' '}
          <Button onClick={()=>chooseButton('deaths')} variant={UIstate.deathsButtonVariant}>{LABELS[UIstate.locale].deaths}</Button>{' '}
        </div>

        <div className="chartContainer">
          <LineChart data={dataObjectForChart} xAxisLabel={LABELS[UIstate.locale].date} yAxisLabel={LABELS[UIstate.locale][UIstate.attributeToGraph]} graphColors={UIstate.graphColors}/>
        </div>
        <div style={{display:'flex',flexDirection:'row',textAlign: 'center',margin: 5}}>
          <div>{UIstate.locale === 'es-pr' ? today.saludTimeSignature : anglifySaludTimeSignature(today.saludTimeSignature)}</div>
        </div>
        <div style={{margin: 5,marginBottom: 20}}>
          <CSVLink data={getDataForDownload()} filename={`${UIstate.attributeToGraph}${removeParentheses(today.saludTimeSignature)}.csv`}>
            <Button variant="success">{UIstate.locale === 'es-pr' ? 'Bajar data ' : "Download data "}<Icon.Download /></Button>
          </CSVLink>
        </div>
        <div style={{display: 'flex',flexDirection: 'column',height: "10vh",alignItems: 'center',textAlign: 'center',marginBottom: 40}}>
          <div style={{fontSize: 13}}>{DISCLAIMER_DIV[UIstate.locale]}</div>
          <div style={{fontSize: 13,margin:10}}>&copy; 2020 <a href="https://github.com/williamrodz/covid19-puertorico-web/blob/master/LICENSE.txt">{UIstate.locale === 'es-pr' ? 'Licencia' : 'License'}</a></div>
          <LoveStatement style={{fontSize: 13,margin:20,}} locale={UIstate.locale}/>
        </div>

      </div>
    );

}
